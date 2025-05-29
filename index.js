  let pdfDoc = null;
        let currentPage = 1;
        let readingInterval = null;
        let isReading = false;
        let animationPaused = false;

        function animateCrawl() {
            const crawlContainer = document.getElementById('crawlContainer');
            if (!animationPaused) {
                crawlContainer.style.animationName = 'none';
                void crawlContainer.offsetWidth; // Trigger reflow
                crawlContainer.style.animationName = 'crawl';
            }
        }
 
    function toggleDNone() {
        var divElement = document.getElementById("sett"); // Değişkeninize div'inizin ID'sini ekleyin
        divElement.classList.toggle("d-none");
    }


        function startReading() {
            readingInterval = setInterval(function () {
                readPage();
                animateCrawl(); // Animate crawl on page change
            }, 30000); // Adjust duration
        }

        function readPage() {
            if (currentPage <= pdfDoc.numPages && currentPage > 0) {
                pdfDoc.getPage(currentPage).then(function (page) {
                    page.getTextContent().then(function (textContent) {
                        document.getElementById('pdfContent').innerText = '';
                        textContent.items.forEach(function (item) {
                            document.getElementById('pdfContent').innerText += item.str + ' ';
                        });
                    });
                });
            }
            updatePageInfo();
        }

        function toggleReading() {
            const crawlContainer = document.getElementById('crawlContainer');
            if (!isReading) {
                isReading = true;
                document.getElementById('toggleReading').innerHTML = '<i class="fas fa-play"></i>';
                animationPaused = false;
                startReading();
                clearInterval(readingInterval);
                crawlContainer.style.animationPlayState = 'paused'; // Animasyonu duraklat
            } else {
                isReading = false;
                document.getElementById('toggleReading').innerHTML = '<i class="fas fa-pause"></i>';
                animationPaused = true;
                crawlContainer.style.animationPlayState = 'running'; // Animasyonu başlat
            }
        }

        function updatePageInfo() {
            document.getElementById('pageInfo').innerText = `Page ${currentPage} of ${pdfDoc.numPages}`;
        }

        function gotoPage() {
            const pageNumber = parseInt(document.getElementById('gotoPageInput').value);
            if (pageNumber >= 1 && pageNumber <= pdfDoc.numPages) {
                currentPage = pageNumber;
                readPage();
                animateCrawl();
            } else {
                alert('Invalid page number!');
            }
        }

        document.getElementById('pdfFile').addEventListener('change', function (event) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = function (event) {
                const typedarray = new Uint8Array(event.target.result);
                pdfjsLib.getDocument(typedarray).promise.then(function (pdf) {
                    pdfDoc = pdf;
                    document.getElementById('toggleReading').classList.remove("d-none"); // Show toggle button
                    document.getElementById('nextPage').classList.remove("d-none");
                    document.getElementById('prevPage').classList.remove("d-none");
                    document.getElementById('crawlContainer').style.display = 'flex'; // Show crawl container
                    document.getElementById('animationTitle').innerText = file.name; // Change animation title
                    document.getElementById('toggleReading').disabled = false; // Enable toggle button
                    document.getElementById('prevPage').disabled = false; // Enable prevPage button
                    document.getElementById('nextPage').disabled = false; // Enable nextPage button
                    document.getElementById('gotoPageInput').value = ''; // Clear gotoPage input
                    document.getElementById('gotoPageInput').placeholder = `${currentPage}`; // Set placeholder
                    readPage();
                });
            };
            reader.readAsArrayBuffer(file);
        });

        document.getElementById('toggleReading').addEventListener('click', function () {
            toggleReading();
        });

        document.getElementById('prevPage').addEventListener('click', function () {
            if (currentPage > 1) {
                currentPage--;
                readPage();
                animateCrawl();
            }
        });

        document.getElementById('nextPage').addEventListener('click', function () {
            if (currentPage < pdfDoc.numPages) {
                currentPage++;
                readPage();
                animateCrawl();
            }
        });

        document.getElementById('gotoPageBtn').addEventListener('click', function () {
            gotoPage();
        });

        window.addEventListener('scroll', function () {
            checkAnimationEnd();
        });