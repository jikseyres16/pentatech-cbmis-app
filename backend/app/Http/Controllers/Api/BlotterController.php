<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Blotter;
use Illuminate\Http\Request;

class BlotterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Blotter::with([
            'complainant:id,first_name,middle_name,last_name',
            'respondent:id,first_name,middle_name,last_name',
        ]);

        if ($request->filled('filter')) {
            $filter = $request->filter;

            $query->where(function ($subQuery) use ($filter) {
                $subQuery->where('incident_details', 'like', "%{$filter}%")
                    ->orWhere('status', 'like', "%{$filter}%")
                    ->orWhereHas('complainant', function ($q) use ($filter) {
                        $q->where('first_name', 'like', "%{$filter}%")
                            ->orWhere('middle_name', 'like', "%{$filter}%")
                            ->orWhere('last_name', 'like', "%{$filter}%");
                    })
                    ->orWhereHas('respondent', function ($q) use ($filter) {
                        $q->where('first_name', 'like', "%{$filter}%")
                            ->orWhere('middle_name', 'like', "%{$filter}%")
                            ->orWhere('last_name', 'like', "%{$filter}%");
                    });
            });
        }

        if ($request->filled('sort')) {
            [$sortCol, $sortDir] = explode('|', $request->sort);
            $allowedSortColumns = ['id', 'incident_date', 'status', 'created_at', 'updated_at'];
            $direction = strtolower($sortDir) === 'desc' ? 'desc' : 'asc';

            if (in_array($sortCol, $allowedSortColumns, true)) {
                $query->orderBy($sortCol, $direction);
            }
        } else {
            $query->latest('incident_date');
        }

        if ((int) $request->per_page === -1) {
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
            'complainant_id' => 'required|exists:constituents,id|different:respondent_id',
            'respondent_id' => 'required|exists:constituents,id|different:complainant_id',
            'incident_date' => 'required|date',
            'incident_details' => 'required|string',
            'status' => 'required|in:active,resolved,dismissed,forwarded',
        ]);

        $blotter = Blotter::create($validatedData)->load([
            'complainant:id,first_name,middle_name,last_name',
            'respondent:id,first_name,middle_name,last_name',
        ]);

        return response()->json($blotter, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Blotter $blotter)
    {
        return $blotter->load([
            'complainant:id,first_name,middle_name,last_name',
            'respondent:id,first_name,middle_name,last_name',
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Blotter $blotter)
    {
        $validatedData = $request->validate([
            'complainant_id' => 'required|exists:constituents,id|different:respondent_id',
            'respondent_id' => 'required|exists:constituents,id|different:complainant_id',
            'incident_date' => 'required|date',
            'incident_details' => 'required|string',
            'status' => 'required|in:active,resolved,dismissed,forwarded',
        ]);

        $blotter->update($validatedData);

        return response()->json($blotter->load([
            'complainant:id,first_name,middle_name,last_name',
            'respondent:id,first_name,middle_name,last_name',
        ]));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Blotter $blotter)
    {
        $blotter->delete();

        return response()->json(null, 204);
    }
}
