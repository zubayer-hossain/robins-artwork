<?php

namespace App\Http\Controllers;

use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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
        try {
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

            return DB::transaction(function () use ($data) {
                $address = Address::create($data);

                return response()->json([
                    'success' => true,
                    'message' => 'Address added successfully',
                    'address' => $address,
                ]);
            });

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Address creation failed: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'data' => $request->all(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to create address. Please try again.',
            ], 500);
        }
    }



    public function update(Request $request, Address $address): JsonResponse
    {
        try {
            // Debug logging
            \Log::info('Address update attempt', [
                'user_id' => Auth::id(),
                'address_user_id' => $address->user_id,
                'address_id' => $address->id,
                'session_id' => $request->session()->getId(),
                'authenticated' => Auth::check(),
                'method' => $request->method(),
                'csrf_token' => $request->header('X-CSRF-TOKEN'),
                'session_csrf' => csrf_token(),
            ]);
            
            // Ensure user owns this address
            if ($address->user_id != Auth::id()) {
                \Log::warning('Unauthorized address access', [
                    'user_id' => Auth::id(),
                    'address_user_id' => $address->user_id,
                    'address_id' => $address->id,
                ]);
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to address.',
                ], 403);
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

            return DB::transaction(function () use ($address, $data) {
                $address->update($data);

                return response()->json([
                    'success' => true,
                    'message' => 'Address updated successfully',
                    'address' => $address,
                ]);
            });

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Address update failed: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'address_id' => $address->id,
                'data' => $request->all(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update address. Please try again.',
            ], 500);
        }
    }

    public function destroy(Address $address): JsonResponse
    {
        try {
            // Debug logging
            \Log::info('Address destroy attempt', [
                'user_id' => Auth::id(),
                'address_user_id' => $address->user_id,
                'address_id' => $address->id,
                'session_id' => request()->session()->getId(),
                'authenticated' => Auth::check(),
            ]);
            
            // Ensure user owns this address
            if ($address->user_id != Auth::id()) {
                \Log::warning('Unauthorized address deletion', [
                    'user_id' => Auth::id(),
                    'address_user_id' => $address->user_id,
                    'address_id' => $address->id,
                ]);
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to address.',
                ], 403);
            }

            return DB::transaction(function () use ($address) {
                $address->delete();

                return response()->json([
                    'success' => true,
                    'message' => 'Address deleted successfully',
                ]);
            });

        } catch (\Exception $e) {
            \Log::error('Address deletion failed: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'address_id' => $address->id,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete address. Please try again.',
            ], 500);
        }
    }

    public function setDefault(Address $address): JsonResponse
    {
        try {
            // Ensure user owns this address
            if ($address->user_id != Auth::id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to address.',
                ], 403);
            }

            return DB::transaction(function () use ($address) {
                // First, set all other addresses of the same type to false
                Address::where('user_id', Auth::id())
                    ->where('type', $address->type)
                    ->where('id', '!=', $address->id)
                    ->update(['is_default' => false]);

                // Then set this address as default
                $address->update(['is_default' => true]);

                return response()->json([
                    'success' => true,
                    'message' => 'Default address updated successfully',
                ]);
            });

        } catch (\Exception $e) {
            \Log::error('Setting default address failed: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'address_id' => $address->id,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to set default address. Please try again.',
            ], 500);
        }
    }
}
