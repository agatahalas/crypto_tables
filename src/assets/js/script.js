$(document).ready(function () {
  // Set current year in footer.
  document.getElementById('currentYear').textContent = new Date().getFullYear();

  getDataFromCoingecko()
    .then(data => {
      let dataTable = initializeDataTable(data);
      const originalData = dataTable.rows().data().toArray();

      // Dodaj obsługę filtra max_price, min_price
      $('#maxPriceInput, #minPriceInput').on('keyup', function () {
        var maxPrice = parseFloat($('#maxPriceInput').val());
        var minPrice = parseFloat($('#minPriceInput').val());
        var currencySwitcher = $('#currencySwitcher').is(':checked');

        if (!isNaN(maxPrice) || !isNaN(minPrice)) {
          // Filtruj oryginalne dane, ktore sa w USD.
          let filteredData = originalData.filter(function (row) {
            const currentPrice = parseFloat(row['current_price']);
            return (!isNaN(maxPrice) ? currentPrice <= maxPrice : true) &&
              (!isNaN(minPrice) ? currentPrice >= minPrice : true);
          });

          if (currencySwitcher) {
            // Odczytaj dane z pliku dla włączonego switchera
            getDataFromCoingecko('btc')
              .then(data => {
                // odfiltruj z tablicy data rekordy, które nie są w filteredData
                let filteredDataBtc = data.filter(function (row) {
                  return filteredData.some(function (currentRow) {
                    return currentRow.id === row.id;
                  });
                });

                // Zaktualizuj dane w tabeli
                dataTable.clear();
                dataTable.rows.add(filteredDataBtc).draw();

              });
          } else {
            // Zaktualizuj dane w tabeli
            dataTable.clear();
            dataTable.rows.add(filteredData).draw();
          }
        } else {
          // Zaktualizuj dane w tabeli - wszystkie rekordy
          dataTable.clear();
          dataTable.rows.add(originalData).draw();
        }
      });

      // Obsługa zmiany currency switchera
      $('#currencySwitcher').on('change', function () {
        var maxPrice = parseFloat($('#maxPriceInput').val());
        var minPrice = parseFloat($('#minPriceInput').val());

        // Sprawdź czy switcher jest włączony
        if ($(this).is(':checked')) {
          getDataFromCoingecko('btc')
            .then(data => {
              var currentFilteredData = dataTable.data().toArray();
              // odfiltruj z tablicy data rekordy, które nie są w currentFilteredData
              data = data.filter(function (row) {
                return currentFilteredData.some(function (currentRow) {
                  return currentRow.id === row.id;
                });
              });

              // Wczytaj nowe dane do DataTables
              dataTable.clear().rows.add(data).draw();
            });

        } else {
          getDataFromCoingecko()
            .then(data => {
              var currentFilteredData = dataTable.data().toArray();
              // odfiltruj z tablicy data rekordy, które nie są w currentFilteredData
              data = data.filter(function (row) {
                return currentFilteredData.some(function (currentRow) {
                  return currentRow.id === row.id;
                });
              });

              // Wczytaj nowe dane do DataTables
              dataTable.clear().rows.add(data).draw();
            });
        }
      });

      // Dodaj obsługę przycisku resetującego
      $('#resetFilters').on('click', function () {
        // Resetuj wartości pól filtrowania
        $('#maxPriceInput').val('').trigger('keyup');
        $('#minPriceInput').val('').trigger('keyup');
      });

    })
    .catch(error => console.error('Wystąpił błąd podczas odczytu danych:', error));
});

function applyColorToNumberAndFormat(number, type, digits_max = 2, data_type = 'number') {
  if (number == null) {
    if (type === 'sort' || type === 'type') {
      return Number.NEGATIVE_INFINITY;
    } else {
      return 'no-data';
    }
  }

  if (type === 'display' || type === 'filter') {
    var color = number >= 0 ? 'green' : 'red';
    var formattedNumber = formatNumber(number, type, digits_max, data_type);
    return `<span style="color: ${color};">${formattedNumber}</span>`;
  }
  return number;
}

function formatNumber(number, event_type, digits_max = 2, data_type = 'number') {
  if (number == null) {
    if (event_type === 'sort' || event_type === 'type') {
      return Number.NEGATIVE_INFINITY;
    } else {
      return 'no-data';
    }
  }

  if (event_type === 'display') {
    let formattedNumber = number.toLocaleString('pl-PL', {
      useGrouping: true,
      maximumFractionDigits: digits_max,
    });
    // For very small numbers like 6.31916e-7 - display number instead 0.
    if (formattedNumber === "0" || formattedNumber === "-0") {
      // Określ, ile cyfr znaczących chcesz zachować. W tym przypadku 4.
      // Cyfry znaczące to przy małych liczbach wszytskie cyfry poza zerami wiodącymi.
      // 0.0003071716 -> 0.0003071
      formattedNumber = Number.parseFloat(number).toPrecision(4);
    }
    if (data_type !== 'number') {
      if (data_type === 'percent') {
        formattedNumber += '%';
      }
      if (data_type === 'finance') {
        var currencySwitcher = $('#currencySwitcher').is(':checked');
        if (currencySwitcher) {
          formattedNumber = '₿ ' + formattedNumber;
        } else {
          formattedNumber = '$ ' + formattedNumber;
        }
      }
    }
    return formattedNumber;
  } else {
    return number;
  }
}

/**
 * Pobiera dane z Coingecko
 *
 * @param currency
 * @param cache_valid_time
 * @param order
 * @param per_page
 * @param page
 * @param sparkline
 * @param price_change_percentage
 * @param locale
 * @returns {Promise<any>}
 */
function getDataFromCoingecko(currency = 'usd', cache_valid_time = 60, order = 'market_cap_desc', per_page = 150, page = 1, sparkline = false, price_change_percentage = '1h%2C24h%2C7d%2C14d%2C30d%2C200d%2C1y', locale = 'en') {
  var usterk_proxy_url = 'http://frog01.mikr.us:21257';
  var url = `${usterk_proxy_url}/coingecko/api/v3/coins/markets?vs_currency=${currency}&cache_valid_time=${cache_valid_time}&order=${order}&per_page=${per_page}&page=${page}&sparkline=${sparkline}&price_change_percentage=${price_change_percentage}&locale=${locale}`;
  return fetch(url)
    .then(response => response.json())
    .then(data => {
      // get last_updated from first record
      $('#date-of-data').text(new Date(data[0].last_updated).toLocaleString());
      return data;
    });
}

function initializeDataTable(data) {
  return $('#cryptoTable').DataTable({
    data: data,
    columns: [
      {data: 'market_cap_rank'},
      {
        data: 'name',
        render: function (data, type, row) {
          // display name and image
          return `<h6><img src="${row.image}" width="20" height="20" /> 
              <a href="https://www.coingecko.com/en/coins/${row.id}" target="_blank">${data}</a> 
              <small>${row.symbol.toUpperCase()}</small></h6>`;
        },
      },
      {
        data: 'current_price',
        render: function (data, type, row) {
          return formatNumber(data, type, 5, 'finance');
        },
      },
      {
        data: 'market_cap',
        render: function (data, type, row) {
          data = data / 1e9; // w mld usd
          data = formatNumber(data, type, 3, 'finance');
          return data;
        },
      },
      {
        data: 'market_cap_change_24h',
        render: function (data, type, row) {
          data = data / 1e6; // w mln usd
          return applyColorToNumberAndFormat(data, type, 2, 'finance');
        },
      },
      {
        data: 'market_cap_change_percentage_24h',
        render: function (data, type, row) {
          return applyColorToNumberAndFormat(data, type, 2, 'percent');
        },
      },
      {
        data: 'price_change_percentage_1h_in_currency',
        render: function (data, type, row) {
          return applyColorToNumberAndFormat(data, type, 2, 'percent');
        },
      },
      {
        data: 'price_change_percentage_24h_in_currency',
        render: function (data, type, row) {
          return applyColorToNumberAndFormat(data, type, 2, 'percent');
        },
      },
      {
        data: 'price_change_percentage_7d_in_currency',
        render: function (data, type, row) {
          return applyColorToNumberAndFormat(data, type, 2, 'percent');
        },
      },
      {
        data: 'price_change_percentage_14d_in_currency',
        render: function (data, type, row) {
          return applyColorToNumberAndFormat(data, type, 2, 'percent');
        },
      },
      {
        data: 'price_change_percentage_30d_in_currency',
        render: function (data, type, row) {
          return applyColorToNumberAndFormat(data, type, 2, 'percent');
        },
      },
      {
        data: 'price_change_percentage_200d_in_currency',
        render: function (data, type, row) {
          return applyColorToNumberAndFormat(data, type, 2, 'percent');
        },
      },
      {
        data: 'price_change_percentage_1y_in_currency',
        render: function (data, type, row) {
          return applyColorToNumberAndFormat(data, type, 2, 'percent');
        },
      }
    ],
    columnDefs: [
      // 65%
      {width: '2%', targets: 0},
      {width: '20%', targets: 1},
      {width: '10%', targets: 2},
      {width: '13%', targets: 3},
      {width: '15%', targets: 4},
      {width: '5%', targets: 5}, // MCap Change 24h %
      // 35%
      {width: '5%', targets: 6},
      {width: '5%', targets: 7},
      {width: '5%', targets: 8},
      {width: '5%', targets: 9},
      {width: '5%', targets: 10},
      {width: '5%', targets: 11},
      {width: '5%', targets: 12},
    ],
    order: [[0, 'asc']], // Sortuj po market_cap_rank rosnąco
    // pageLength: 100, // Wyświetlaj 100 rekordów na stronie
    fixedHeader: true, // Włącz sticky header
    paging: false, // Wyłącz paginację
    // responsive: true, // Włącz responsywność
    //  autoWidth: false, // Ustaw auto szerokosc dla kolumn
    searching: true,
    language: {
      search: '', // Usunięcie etykiety z pola wyszukiwania
      searchPlaceholder: 'Search...', // Dodanie placeholdera
    },
  });
}
