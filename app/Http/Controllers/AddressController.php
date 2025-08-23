<?php

namespace App\Http\Controllers;

use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AddressController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $addresses = $user->addresses()->orderBy('is_default', 'desc')->orderBy('created_at', 'desc')->get();

        return Inertia::render('Dashboard/Addresses/Index', [
            'addresses' => $addresses,
        ]);
    }



    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'type' => 'required|in:shipping,billing',
            'label' => 'nullable|string|max:50',
            'name' => 'required|string|max:100',
            'company' => 'nullable|string|max:100',
            'address_line_1' => 'required|string|max:255',
            'address_line_2' => 'nullable|string|max:255',
            'city' => 'required|string|max:100',
            'state_province' => 'required|string|max:100',
            'postal_code' => 'required|string|max:20',
            'country' => 'required|string|max:100',
            'phone' => 'nullable|string|max:20',
            'is_default' => 'boolean',
        ]);

        $userId = Auth::id();
        $data = $request->all();
        $data['user_id'] = $userId;

        // Keep it simple - just create the address

        $address = Address::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Address added successfully',
            'address' => $address,
        ]);
    }



    public function update(Request $request, Address $address): JsonResponse
    {
        // Ensure user owns this address
        if ($address->user_id !== Auth::id()) {
            abort(403, 'Unauthorized access to address.');
        }

        $request->validate([
            'type' => 'required|in:shipping,billing',
            'label' => 'nullable|string|max:50',
            'name' => 'required|string|max:100',
            'company' => 'nullable|string|max:100',
            'address_line_1' => 'required|string|max:255',
            'address_line_2' => 'nullable|string|max:255',
            'city' => 'required|string|max:100',
            'state_province' => 'required|string|max:100',
            'postal_code' => 'required|string|max:20',
            'country' => 'required|string|max:100',
            'phone' => 'nullable|string|max:20',
            'is_default' => 'boolean',
        ]);

        $data = $request->all();

        // Keep it simple - just update the address

        $address->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Address updated successfully',
            'address' => $address,
        ]);
    }

    public function destroy(Address $address): JsonResponse
    {
        // Ensure user owns this address
        if ($address->user_id !== Auth::id()) {
            abort(403, 'Unauthorized access to address.');
        }

        $address->delete();

        return response()->json([
            'success' => true,
            'message' => 'Address deleted successfully',
        ]);
    }

    public function setDefault(Address $address): JsonResponse
    {
        // Ensure user owns this address
        if ($address->user_id !== Auth::id()) {
            abort(403, 'Unauthorized access to address.');
        }

        // Just set this address as default
        $address->update(['is_default' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Default address updated successfully',
        ]);
    }
}
