<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Constituent;
use App\Models\Blotter;

class DashboardController extends Controller
{
    public function stats()
    {
        $constituents = Constituent::count();
        $blotters = Blotter::count();

        return response()->json([
            'constituents' => $constituents,
            'blotters' => $blotters,
        ]);
    }
}
