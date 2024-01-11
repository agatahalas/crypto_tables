<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crypto Tables</title>
    <link rel="shortcut icon" href="assets/img//bitcoin.png">

    <!-- Dołącz pliki DataTables -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/foundation/6.4.3/css/foundation.min.css" rel="stylesheet">
    <link href="https://cdn.datatables.net/v/zf/jq-3.7.0/dt-1.13.8/datatables.min.css" rel="stylesheet">
    <!-- Dołącz Twoje pliki CSS -->
    <link rel="stylesheet" type="text/css" href="assets/css/style.css">
</head>
<body class="grid-container grid-padding-x">

<header>
    <div class="grid-container">
        <div class="grid-x grid-padding-x">
            <div class="cell small-12">
                <h1 class="text-center">$$$ Crypto Tables $$$</h1>
            </div>
        </div>
    </div>
</header>

<div class="grid-container">
    <div class="grid-x grid-padding-x">
        <div class="cell small-12 medium-2">
            <label for="maxPriceInput">Max Price $:</label>
            <input type="number" id="maxPriceInput" step="0.01" placeholder="0.50">
        </div>
        <div class="cell small-12 medium-2">
            <label for="minPriceInput">Min Price $:</label>
            <input type="number" id="minPriceInput" step="0.01" placeholder="0.01">
        </div>
    </div>
    <div class="grid-x grid-padding-x">
        <div class="cell small-12 medium-3">
            <div class="switch large">
                <input class="switch-input" id="currencySwitcher" type="checkbox" name="currencySwitcher">
                <label class="switch-paddle" for="currencySwitcher">
                    <span class="switch-active" aria-hidden="true" style="font-size: 0.8rem; color: white">BTC</span>
                    <span class="switch-inactive" aria-hidden="true" style="font-size: 0.8rem;  color: black">USD</span>
                </label>
            </div>
        </div>
    </div>
    <div class="grid-x grid-padding-x">
        <div class="cell small-12 medium-3">
            <p class="text-left">Last update: <span id="date-of-data"></span></p>
            <button class="submit primary button" id="refresh-data" disabled>Refresh data</button>
        </div>
    </div>
</div>

<table id="cryptoTable" class="display" style="width:100%; margin-top: 20px;">
    <thead>
    <tr>
        <th>#</th>
        <th>Name</th>
        <th>Current Price</th>
        <th>Market Cap (billion)</th>
        <th>Market Cap Change 24h (million)</th>
        <th>Market Cap Change % 24h</th>
        <th>1h %</th>
        <th>24h %</th>
        <th>7d %</th>
        <th>14d %</th>
        <th>30d %</th>
        <th>200d %</th>
        <th>1y %</th>
    </tr>
    <!-- Nagłówki kolumn będą renderowane tutaj -->
    </thead>
    <tbody>
    <!-- Dane tabeli będą renderowane tutaj -->
    </tbody>
</table>

<!-- Dołącz pliki DataTables JS i jQuery -->
<script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>

<script src="https://cdn.datatables.net/1.13.7/js/jquery.dataTables.min.js"></script>
<script src="https://cdn.datatables.net/responsive/2.5.0/js/dataTables.responsive.min.js"></script>
<script src="https://cdn.datatables.net/fixedheader/3.4.0/js/dataTables.fixedHeader.min.js"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/foundation/6.4.3/js/foundation.min.js"></script>

<!-- Dołącz Twoje pliki JavaScript -->
<script src="assets/js/script.js"></script>

</body>
</html>
