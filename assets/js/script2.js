// NOWA WERSJA z refactoringiem

$(document).ready(function () {
  // Początkowe wywołanie funkcji bez pobierania danych z pliku lokalnego
  fetchDataAndUpdateTable();

  // Dodaj obsługę filtra max_price, min_price
  $('#maxPriceInput, #minPriceInput').on('keyup', function () {
    handlePriceFilter();
  });

  // Obsługa zmiany stanu przycisku switchera
  $('#currencySwitcher').on('change', function () {
    fetchDataAndUpdateTable(); // Aktualizacja danych przy zmianie switchera
  });
});

// FUNCTIONS

function initializeDataTable(data) {
  return $('#cryptoTable').DataTable({
    data: data,
    columns: [
      { data: 'market_cap_rank' },
      {
        data: 'name',
        render: function (data, type, row) {
          // display name and image
          return `<h6><img src="${row.image}" width="20" height="20" /> ${data} <small>${row.symbol.toUpperCase()}</small></h6>`;
        },
      },
      {
        data: 'market_cap',
        render: function (data, type, row) {
          data = data / 1e9; // w mld usd
          data = formatNumber(data, 2);
          return data;
        },
      },
      {
        data: 'current_price',
        render: function (data, type, row) {
          const formattedData = formatNumber(data, 5);
          if (formattedData === "0") {
            return data;
          } else {
            return formattedData;
          }
        },
      },
      {
        data: 'market_cap_change_24h',
        render: function (data, type, row) {
          data = data / 1e6; // w mln usd
          return applyColorToNumberAndFormat(data, type);
        },
      },
      {
        data: 'market_cap_change_percentage_24h',
        render: function (data, type, row) {
          return applyColorToNumberAndFormat(data, type);
        },
      },
      {
        data: 'price_change_percentage_1h_in_currency',
        render: function (data, type, row) {
          return applyColorToNumberAndFormat(data, type);
        },
      },
      {
        data: 'price_change_percentage_24h_in_currency',
        render: function (data, type, row) {
          return applyColorToNumberAndFormat(data, type);
        },
      },
      {
        data: 'price_change_percentage_7d_in_currency',
        render: function (data, type, row) {
          return applyColorToNumberAndFormat(data, type);
        },
      },
      {
        data: 'price_change_percentage_14d_in_currency',
        render: function (data, type, row) {
          return applyColorToNumberAndFormat(data, type);
        },
      },
      {
        data: 'price_change_percentage_30d_in_currency',
        render: function (data, type, row) {
          return applyColorToNumberAndFormat(data, type);
        },
      },
      {
        data: 'price_change_percentage_200d_in_currency',
        render: function (data, type, row) {
          return applyColorToNumberAndFormat(data, type);
        },
      },
      {
        data: 'price_change_percentage_1y_in_currency',
        render: function (data, type, row) {
          return applyColorToNumberAndFormat(data, type);
        },
      },
    ],
    order: [[0, 'asc']], // Sortuj po market_cap_rank rosnąco
    pageLength: 100, // Wyświetlaj 100 rekordów na stronie
    fixedHeader: true, // Włącz sticky header
    paging: false, // Wyłącz paginację
    responsive: true, // Włącz responsywność
    autoWidth: true, // Ustaw auto szerokosc dla kolumn
    searching: true,
  });
}

function handlePriceFilter(originalData, dataTable) {
  var maxPrice = parseFloat($('#maxPriceInput').val());
  var minPrice = parseFloat($('#minPriceInput').val());
  var currencySwitcher = $('#currencySwitcher').is(':checked');

  if (!isNaN(maxPrice) || !isNaN(minPrice)) {
    let filteredData = originalData.filter(function (row) {
      const currentPrice = parseFloat(row['current_price']);
      return (!isNaN(maxPrice) ? currentPrice <= maxPrice : true) &&
        (!isNaN(minPrice) ? currentPrice >= minPrice : true);
    });

    if (currencySwitcher) {
      fetchDataAndUpdateTable('assets/data/data-btc.json', filteredData, dataTable);
    } else {
      dataTable.clear();
      dataTable.rows.add(filteredData).draw();
    }
  } else {
    dataTable.clear();
    dataTable.rows.add(originalData).draw();
  }
}

function handleCurrencySwitch(originalData, dataTable) {
  var maxPrice = parseFloat($('#maxPriceInput').val());
  var minPrice = parseFloat($('#minPriceInput').val());

  if ($('#currencySwitcher').is(':checked')) {
    fetchDataAndUpdateTable('assets/data/data-btc.json', originalData, dataTable);
  } else {
    fetchDataAndUpdateTable('assets/data/data-usd.json', originalData, dataTable);
  }
}

function fetchDataAndUpdateTable(filterData, dataTable) {
  var apiUrl = 'http://frog01.mikr.us:21257';
  var maxPrice = parseFloat($('#maxPriceInput').val());
  var minPrice = parseFloat($('#minPriceInput').val());

  if ($('#currencySwitcher').is(':checked')) {
    apiUrl += '/coingecko/api/v3/coins/markets?vs_currency=btc&order=market_cap_desc&per_page=150&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d%2C14d%2C30d%2C200d%2C1y&locale=en';
  } else {
    apiUrl += '/coingecko/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=150&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d%2C14d%2C30d%2C200d%2C1y&locale=en';
  }

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      let filteredData = data.filter(function (row) {
        return filterData.some(function (currentRow) {
          return currentRow.id === row.id;
        });
      });

      dataTable.clear();
      dataTable.rows.add(filteredData).draw();
    });
}

function getDataFromCoingecko(currency = 'usd', order = 'market_cap_desc', per_page = 150, page = 1, sparkline = false, price_change_percentage = '1h%2C24h%2C7d%2C14d%2C30d%2C200d%2C1y', locale = 'en') {
  var usterk_proxy_url = 'http://frog01.mikr.us:21257';
  var url = `${usterk_proxy_url}/coingecko/api/v3/coins/markets?vs_currency=${currency}&order=${order}&per_page=${per_page}&page=${page}&sparkline=${sparkline}&price_change_percentage=${price_change_percentage}&locale=${locale}`;
  return fetch(url)
    .then(response => response.json())
    .then(data => {
      return data;
    });
}
