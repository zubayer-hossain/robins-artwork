<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    private const ROLES = ['customer', 'admin'];

    public function index(Request $request): Response
    {
        $query = User::query()->with('roles');

        // Search
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter by ban status
        $filter = $request->input('filter', 'all');
        if ($filter === 'banned') {
            $query->shadowBanned();
        } elseif ($filter === 'not_banned') {
            $query->notShadowBanned();
        }

        $users = $query->orderBy('created_at', 'desc')
            ->paginate(20)
            ->withQueryString()
            ->through(function (User $user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'email_verified_at' => $user->email_verified_at?->toIso8601String(),
                    'roles' => $user->roles->pluck('name')->toArray(),
                    'is_shadow_banned' => $user->is_shadow_banned,
                    'shadow_banned_at' => $user->shadow_banned_at?->format('M j, Y H:i'),
                    'shadow_ban_reason' => $user->shadow_ban_reason,
                    'created_at' => $user->created_at?->format('M j, Y'),
                ];
            });

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'currentUserId' => $request->user()->id,
            'filters' => [
                'search' => $request->input('search'),
                'filter' => $filter,
            ],
        ]);
    }

    public function ban(Request $request, User $user)
    {
        if ($user->hasRole('admin')) {
            return back()->with('error', 'Cannot ban an admin.');
        }
        if ($user->id === $request->user()->id) {
            return back()->with('error', 'Cannot ban yourself.');
        }

        $user->update([
            'is_shadow_banned' => true,
            'shadow_banned_at' => now(),
            'shadow_ban_reason' => $request->input('reason'),
        ]);

        return back()->with('success', 'User has been banned. They will not be able to log in.');
    }

    public function unban(User $user)
    {
        if ($user->hasRole('admin')) {
            return back()->with('error', 'Cannot change ban status of an admin.');
        }

        $user->update([
            'is_shadow_banned' => false,
            'shadow_banned_at' => null,
            'shadow_ban_reason' => null,
        ]);

        return back()->with('success', 'User has been unbanned.');
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Users/Create', [
            'roles' => self::ROLES,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $valid = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role' => ['required', 'string', Rule::in(self::ROLES)],
        ]);

        $user = User::create([
            'name' => $valid['name'],
            'email' => $valid['email'],
            'password' => Hash::make($valid['password']),
        ]);
        $user->syncRoles([$valid['role']]);

        return redirect()->route('admin.users.index')->with('success', 'User created successfully.');
    }

    public function show(User $user): Response
    {
        $user->load('roles');
        $user->loadCount(['orders', 'addresses']);

        return Inertia::render('Admin/Users/Show', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'email_verified_at' => $user->email_verified_at?->format('M j, Y H:i'),
                'roles' => $user->roles->pluck('name')->toArray(),
                'is_shadow_banned' => $user->is_shadow_banned,
                'shadow_banned_at' => $user->shadow_banned_at?->format('M j, Y H:i'),
                'shadow_ban_reason' => $user->shadow_ban_reason,
                'created_at' => $user->created_at?->format('M j, Y H:i'),
                'updated_at' => $user->updated_at?->format('M j, Y H:i'),
                'orders_count' => $user->orders_count,
                'addresses_count' => $user->addresses_count,
            ],
            'currentUserId' => request()->user()->id,
        ]);
    }

    public function edit(User $user): Response
    {
        $user->load('roles');
        $role = $user->roles->first()?->name ?? 'customer';

        return Inertia::render('Admin/Users/Edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $role,
            ],
            'roles' => self::ROLES,
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'role' => ['required', 'string', Rule::in(self::ROLES)],
        ];
        if ($request->filled('password')) {
            $rules['password'] = ['string', 'min:8', 'confirmed'];
        }
        $valid = $request->validate($rules);

        $user->name = $valid['name'];
        $user->email = $valid['email'];
        if (! empty($valid['password'] ?? null)) {
            $user->password = Hash::make($valid['password']);
        }
        $user->save();
        $user->syncRoles([$valid['role']]);

        return redirect()->route('admin.users.index')->with('success', 'User updated successfully.');
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        if ($user->id === $request->user()->id) {
            return back()->with('error', 'You cannot delete your own account.');
        }
        if ($user->hasRole('admin') && User::role('admin')->count() <= 1) {
            return back()->with('error', 'Cannot delete the last admin.');
        }
        if ($user->orders()->exists()) {
            return back()->with('error', 'Cannot delete user with orders. Remove or reassign orders first.');
        }

        $user->addresses()->delete();
        $user->cartItems()->delete();
        $user->favorites()->delete();
        $user->recentViews()->delete();
        $user->syncRoles([]);
        $user->delete();

        return redirect()->route('admin.users.index')->with('success', 'User deleted successfully.');
    }
}
