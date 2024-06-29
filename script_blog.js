let DATA = null;
let CUR_PAGE = 1;
let NUM_PER_PAGE = 40;
let CUR_SORT = null;
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
                <table class="table table-striped" id="blogTable">
                    <thead>
                        <tr>
                            <th>标题</th>
                            <th>作者</th>
                            <th>理由</th>
                            <th>日期</th>
                        </tr>
                    </thead>
                    <tbody id="tableBody">
                        <!-- Table rows will be inserted here -->
                    </tbody>
                </table>
                <nav aria-label="Page navigation">
                    <ul class="pagination" id="pagination">
                        <!-- Pagination buttons will be inserted here -->
                    </ul>
                </nav>
            </div>`);
            console.log(resp.slice(0,10))
            DATA = resp;
            CUR_PAGE = 1;

            // Initial display
            displayTable(CUR_PAGE);
            setupPagination();
            setupSortingListeners();
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

    const currentHeader = document.querySelector(`#blogTable th:nth-child(${['title', 'author', 'reason', 'date'].indexOf(column) + 1})`);
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

    displayTable(1);
    setupPagination();
  }
  
function displayTable(page) {
    const tableBody = document.getElementById('tableBody');
    const startIndex = (page - 1) * NUM_PER_PAGE;
    const endIndex = startIndex + NUM_PER_PAGE;
    const pageData = DATA.slice(startIndex, endIndex);

    tableBody.innerHTML = '';
    pageData.forEach(item => {
        const row = `<tr>
            <td><a href="https://bgm.tv/blog/${item.blog}" target="_blank">${item.title}</a></td>
            <td>${item.author}</td>
            <td>${item.reason}</td>
            <td>${new Date(item.date).toLocaleString().split(',')[0]}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

function setupPagination() {
    const pageCount = Math.ceil(DATA.length / NUM_PER_PAGE);
    const paginationElement = document.getElementById('pagination');
    paginationElement.innerHTML = '';

    for (let i = 1; i <= pageCount; i++) {
        const li = document.createElement('li');
        li.classList.add('page-item');
        if (i === CUR_PAGE) {
            li.classList.add('active');
        }
        const a = document.createElement('a');
        a.classList.add('page-link');
        a.href = '#';
        a.textContent = i;
        a.addEventListener('click', (e) => {
            e.preventDefault();
            CUR_PAGE = i;
            displayTable(CUR_PAGE);
            setupPagination();
        });
        li.appendChild(a);
        paginationElement.appendChild(li);
    }
}

function setupSortingListeners() {
const headers = document.querySelectorAll('#blogTable th');
headers.forEach(header => {
    header.style.cursor = 'pointer';
    header.addEventListener('click', () => {
        const column = header.textContent.toLowerCase();
        sortData(column === 'blog id' ? 'blog' : column);
    });
});
}

