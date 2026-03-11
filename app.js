// Esperamos a que la página HTML termine de cargar completamente antes de ejecutar código
document.addEventListener('DOMContentLoaded', () => {
    // --- 1. BUSCAMOS LOS ELEMENTOS DEL HTML PARA PODER MODIFICARLOS ---
    // Guardamos en variables (constantes) qué partes de la web queremos utilizar
    const cryptoContainer = document.getElementById('crypto-container');
    const loadingSpinner = document.getElementById('loading');
    // Esta variable global guardará todas las monedas que nos devuelva internet centralmente
    let cryptoData = [];
    // --- 2. FUNCIÓN PARA DESCARGAR LOS DATOS DE INTERNET (API) ---
    // Usamos 'async' porque bajar datos de internet toma unos segundos y el código debe "esperar"
    async function fetchCryptos() {
        try {
            // Dirección oficial (API) de CoinGecko pidiendo 25 monedas en dólares
            const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false';
            // fetch descarga la información y await espera a que termine
            const response = await fetch(url);
            // Convertimos esa información de texto a formato JavaScript comprensible (JSON)
            cryptoData = await response.json();
            // Ya llegaron los datos, así que borramos la animación de "cargando"
            if (loadingSpinner) {
                loadingSpinner.style.display = 'none';
            }
            // Llamamos a la función que dibuja las tarjetas, mandándole los datos recién bajados
            renderCards(cryptoData);
        } catch (error) {
            // Si algo falla (ej. no hay internet), mostramos un mensaje de error en la pantalla
            cryptoContainer.innerHTML = `<div style="color:red; text-align:center;">Hubo un problema al cargar los datos.</div>`;
        }
    }
    // --- 3. FUNCIÓN QUE "DIBUJA" LAS TARJETAS EN LA PANTALLA ---
    // Recibe como parámetro la lista de monedas (data)
    function renderCards(data) {
        // Primero, limpiamos la pantalla entera
        cryptoContainer.innerHTML = '';
        // Recorremos la lista de monedas una a una con un bucle forEach
        data.forEach(coin => {
            // ¿El precio subió o bajó en las últimas 24 horas? 
            const change24h = coin.price_change_percentage_24h || 0;
            // Si es mayor a 0, usamos la clase CSS verde ("positive"). Si no, rojo ("negative")
            const classColor = change24h >= 0 ? 'positive' : 'negative';
            const signoLogico = change24h >= 0 ? '+' : '';
            // Formateamos el número para que sea bonito por ejemplo: "$1,200.50"
            const precioBonito = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            }).format(coin.current_price);
            // Inyectamos un "bloque" de HTML, moneda por moneda, sumándolo a lo que ya había (+=)
            cryptoContainer.innerHTML += `
                <div class="crypto-card">
                    
                    <div class="card-header">
                        <img src="${coin.image}" alt="${coin.name}" class="crypto-icon">
                        <div class="crypto-info">
                            <h2 class="crypto-name">${coin.name}</h2>
                            <span class="crypto-symbol">${coin.symbol.toUpperCase()}</span>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="crypto-price">${precioBonito}</div>
                        <!-- Aquí va el porcentaje coloreado dependiendo de si subió o bajó -->
                        <div class="crypto-change ${classColor}">
                            ${signoLogico}${change24h.toFixed(2)}% (24h)
                        </div>
                    </div>
                </div>
            `;
        });
    }

    // --- 5. COMENZAR EL PROGRAMA ---
    // Cuando abrimos la página por primera vez, ejecutamos la función de descarga automática
    fetchCryptos();
});
