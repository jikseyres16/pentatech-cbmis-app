<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Constituent;

class ConstituentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Constituent::query();

        if ($request->has('sort')) {
            list($sortCol, $sortDir) = explode('|', $request->sort);
            $query->orderBy($sortCol, $sortDir);
        }

        if ($request->has('filter')) {
            $query->where('first_name', 'like', "%{$request->filter}%")
                ->orWhere('last_name', 'like', "%{$request->filter}%");
        }

        if ($request->per_page == -1) {
            return $query->get();
        }

        return $query->paginate($request->per_page ?? 10);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'date_of_birth' => 'required|date',
            'place_of_birth' => 'required|string|max:255',
            'gender' => 'required|string|max:255',
            'civil_status' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'contact_number' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:constituents,email',
        ]);

        $constituent = Constituent::create($validatedData);

        return response()->json($constituent, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Constituent $constituent)
    {
        $validatedData = $request->validate([
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'date_of_birth' => 'required|date',
            'place_of_birth' => 'required|string|max:255',
            'gender' => 'required|string|max:255',
            'civil_status' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'contact_number' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:constituents,email,' . $constituent->id,
        ]);

        $constituent->update($validatedData);

        return response()->json($constituent);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Constituent $constituent)
    {
        $constituent->delete();

        return response()->json(null, 204);
    }
}
