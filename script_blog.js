let DATA = null;
let CUR_PAGE = 1;
let NUM_PER_PAGE = 40;
let CUR_SORT = "date";
let CUR_SORT_ASC = true;

const RETRY = 3;
const RETRY_INTERVAL = 2000;

function deleteLoading(){
    $('.dummy_bg_nonoverlay').html('');
}
function addLoading(){
    $('.dummy_bg_nonoverlay').html(`
        <div class="loading_wrapper">
            <div class="circle"></div>
            <div class="circle"></div>
            <div class="circle"></div>
        </div>`
    )
}

function fetchList(){
    // deprecated lucky
    const url = 'https://eastasia.azure.data.mongodb-api.com/app/bangumibiweekly-hikvo/endpoint/dump_reco';
    let ajax_req = {
        tryCount: 0,
        retryLimit: RETRY,
        retryInterval: RETRY_INTERVAL,
        timeout: 10000,
        contentType: 'application/json',
        type: 'GET',
        url: url,
        success: function(resp) {
            deleteLoading();
            $('#canvas_inner').html(`
            <div class="table_container mt-5">
                <div class="banner_mid elegent">
                    <table class="table table-striped" id="blogTable">
                        <thead>
                            <tr>
                                <th style="font-weight:700;" class="date-column">日期</th>
                                <th style="font-weight:700;">标题</th>
                                <th style="font-weight:700;">作者</th>
                                <th style="font-weight:700;">理由</th>
                            </tr>
                        </thead>
                        <tbody id="tableBody">
                            <!-- Table rows will be inserted here -->
                        </tbody>
                    </table>
                </div>
            </div>
            `);
            $('#myfooter').before(`
            <nav aria-label="Page navigation">
                    <ul class="pagination" id="pagination">
                        <!-- Pagination buttons will be inserted here -->
                    </ul>
            </nav>`)
            console.log(resp.slice(0,10))
            DATA = resp;
            CUR_PAGE = 1;

            // Initial display
            displayTable(CUR_PAGE);
            setupPagination();
            setupSortingListeners();
            sortData('date');
        },
        error: function(resp) {
            ajax_req.tryCount++;
            if (ajax_req.tryCount <= ajax_req.retryLimit) {
                setTimeout(function(){
                                console.log('[bgm_lucky] retry ...'); 
                                $.ajax(ajax_req);
                            }, ajax_req.retryInterval);
                return;
            } else {
                $('#canvas_inner').html('<h2 style="text-align:center">服务器正在ICU抢救中 🚑 ... </h2>');
            }
            return;
        }
    };
    $.ajax(ajax_req);
}

fetchList();


function sortData(column) {
    const headers = document.querySelectorAll('#blogTable th');
    headers.forEach(header => {
        header.classList.remove('sort-indicator', 'descending');
    });

    if (CUR_SORT === column) {
        CUR_SORT_ASC = !CUR_SORT_ASC;
    } else {
        CUR_SORT = column;
        CUR_SORT_ASC = true;
    }

    const currentHeader = document.querySelector(`#blogTable th:nth-child(${['date', 'title', 'author', 'reason'].indexOf(column) + 1})`);
    currentHeader.classList.add('sort-indicator');
    if (!CUR_SORT_ASC) {
        currentHeader.classList.add('descending');
    }

    DATA.sort((a, b) => {
        let valueA = a[column];
        let valueB = b[column];

        if (column === 'date') {
            valueA = new Date(valueA);
            valueB = new Date(valueB);
        }

        if (valueA < valueB) return CUR_SORT_ASC ? -1 : 1;
        if (valueA > valueB) return CUR_SORT_ASC ? 1 : -1;
        return 0;
    });
    CUR_PAGE = 1;
    displayTable(CUR_PAGE);
    setupPagination();
  }

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function displayTable(page) {
    const tableBody = document.getElementById('tableBody');
    const startIndex = (page - 1) * NUM_PER_PAGE;
    const endIndex = startIndex + NUM_PER_PAGE;
    const pageData = DATA.slice(startIndex, endIndex);
    const tb = $('#tableBody');
    tb.hide()
    tableBody.innerHTML = '';
    pageData.forEach(item => {
        const row = `<tr>
            <td class="date-column table_font">${formatDate(item.date)}</td>
            <td ><a href="https://bgm.tv/blog/${item.blog}" target="_blank" class="table_font">${item.title}</a></td>
            <td ><a href="https://bgm.tv/user/${item.author}" target="_blank" class="table_font">${item.author}</a></td>
            <td class="table_font">${item.reason}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
    tb.fadeIn()
}

function setupPagination() {
    const pageCount = Math.ceil(DATA.length / NUM_PER_PAGE);
    const paginationElement = document.getElementById('pagination');
    paginationElement.innerHTML = '';

    // for (let i = 1; i <= pageCount; i++) {
    //     const li = document.createElement('li');
    //     li.classList.add('page-item');
    //     if (i === CUR_PAGE) {
    //         li.classList.add('active');
    //     }
    //     const a = document.createElement('a');
    //     a.classList.add('page-link');
    //     a.href = '#';
    //     a.textContent = i;
    //     a.addEventListener('click', (e) => {
    //         e.preventDefault();
    //         CUR_PAGE = i;
    //         displayTable(CUR_PAGE);
    //         setupPagination();
    //     });
    //     li.appendChild(a);
    //     paginationElement.appendChild(li);
    // }
    const page_span = 3;
    let start = Math.max(1, CUR_PAGE - page_span);
    let end = Math.min(pageCount, CUR_PAGE + page_span);
    if (start === 1) {
        end = Math.min(pageCount, start + 2 * page_span);
    }
    if (end === pageCount) {
        start = Math.max(1, end - 2 * page_span);
    }
    function add_page_btn(text, page){
        const li = document.createElement('li');
        li.classList.add('page-item');
        if (page === CUR_PAGE) {
            li.classList.add('active');
        }
        const a = document.createElement('a');
        a.classList.add('page-link');
        a.href = '#';
        a.textContent = text;
        a.addEventListener('click', (e) => {
            e.preventDefault();
            CUR_PAGE = page;
            displayTable(CUR_PAGE);
            setupPagination();
        });
        li.appendChild(a);
        paginationElement.appendChild(li);
    }
    if (CUR_PAGE > 1) {
        add_page_btn('❚◀', 1);
    }
    for (let i = start; i <= end; i++) {
        add_page_btn(i, i);
    }
    if (pageCount > CUR_PAGE) {
        add_page_btn('▶❚', pageCount);
    }

}

function setupSortingListeners() {
const headers = document.querySelectorAll('#blogTable th');
headers.forEach(header => {
    header.style.cursor = 'pointer';
    header.addEventListener('click', () => {
        const column = header.textContent.toLowerCase();
        const mapping = {
            "标题" : "title",
            "作者" : "author",
            "理由" : "reason",
            "日期" : "date"
        }
        sortData(mapping[column]);
    });
});
}

(function(){
    const header_height = $('#myheader').height();
    const header_blur = $('#myheaderblur');
    header_blur.css('height', `${header_height + 100}px`);

    const footer_height = $('#myfooter').height();
    const footer_blur = $('#myfooterblur');
    footer_blur.css('height', `${footer_height + 150}px`);
})();
  