//console.log('works');

const LUCKY_LOGIN_KEY = "LUCKY_LOGIN";
var LOGIN_TOKEN_TICKET = null;
addLoginPanel();
addStyle();

function addStyle() {
    const style = document.createElement('style');
    style.innerHTML = `
    `;
    document.head.appendChild(style);
}

function addLogoutBtn(login_info) {
    const logout_btn_raw = '<a id="lucky_logout" class="btnBlueSmall" style="color: #FFF; cursor:pointer;">取消授权</a>';
    const logout_prompt = `授权状态: ${login_info.uname} 已授权 ${logout_btn_raw}`;
    $('#lucky_login_status').html(logout_prompt);
    $('#lucky_logout').on('click', function(){
        localStorage.removeItem(LUCKY_LOGIN_KEY);
        console.log('[bgm_luck] previous token has been removed');
        addLoginBtn();
    });
}

function disable_btn(btn, prompt) {
    btn.css('cursor', 'default');
    btn.css('background', 'grey');
    btn.html(prompt);
    btn.unbind();
}

function enable_btn(btn, prompt, func) {
    btn.css('cursor', 'pointer');
    btn.css('background', '');
    btn.html(prompt);
    btn.unbind();
    btn.on('click', func);
}

function addLoginPanel() {
    const loginPanel = `
        <div id="lucky_login_panel" class="ui-draggable">
            <div class="sidePanelHome">
            <h2 class="subtitle" style="cursor:pointer;">Feeling Lucky 设置</h2>
            <ul class="timeline" style="margin: 0px 5px; display: block;">
                <li id="lucky_login_status"></li>
                <li>短评盲盒范围: all</li>
                <li>每日popup: True</li>
            </ul>
        </div></div>
    `;
    $('#columnHomeB').find('.sideInner').append(loginPanel);

    // update lucky_login_status
    let login_info = localStorage.getItem(LUCKY_LOGIN_KEY);
    let cur_uid = getUid()
    if (login_info) {
        login_info = JSON.parse(login_info);
        if (login_info.uid === cur_uid)
            addLogoutBtn(login_info);
        else {
            localStorage.removeItem(LUCKY_LOGIN_KEY);
            console.log('[bgm_luck] remove last user token');
            addLoginBtn();
        }
    } else {
        addLoginBtn();
    }
}

function getUid() {
    const user = $('.idBadgerNeue').find('a.avatar');
    let uid = user.attr('href').split('/');
    uid = uid[uid.length -1];
    return uid;
}

function addLoginBtn() {
    const login_prompt = '授权状态: 未授权 <a id="lucky_login_btn" class="btnPinkSmall" style="color: #FFF; cursor:pointer;">点击授权</a>';
    $('#lucky_login_status').html(login_prompt);
    // bind login function
    const login_btn = $('#lucky_login_btn');
    login_btn.on('click', function() {

        // 0: change btn style and words, and unbind
        disable_btn(login_btn, '授权请求中 ...');

        const uid = getUid();
        // 1.1: jump to oauth
        let callback_timeout;
        let child_close_timer;
        const callback_create = function(resp) {
            login_btn.html('请在弹出页里授权');
            LOGIN_TOKEN_TICKET = resp.ticket;
            console.log(`[bgm_luck] fetched ticket ${LOGIN_TOKEN_TICKET} for ${uid}`);
            const child = window.open(resp.oauth_url, "","width=550,height=550,toolbar=0,status=0,");
            callback_timeout = setTimeout(next_step, '3000') // enable manual toggle after 3s
            child_close_timer = setInterval(function() {           // detect child close 
                if(child.closed) {
                    clearInterval(child_close_timer);
                    clearTimeout(callback_timeout);
                    console.log('[bgm_luck] pop up closed');
                    fetch_token();
                }
            }, 500);
        };

        // 1.0: send out login create request
        const paras = `?uid=${uid}&domain=${location.hostname}`;
        console.log(`[bgm_luck] create lucky token for ${uid}`);
        $.ajax({
            timeout: 5000,
            type:'POST',
            crossDomain: true,
            contentType: 'application/json',
            url: 'https://eastasia.azure.data.mongodb-api.com/app/bgm_oauth_login-temed/endpoint/create_token' + paras,
            dataType: 'json',
            data: '{"api-key":"NgqM6Rij0CZ7hBniHJdgydcqSKUDMUSl6bhHciCXo8rk39PhPkL8VrkpEkZqDkUm"}',
            success : callback_create,
            error : function() {
                console.warn('[bgm_luck] fail to ask for oauth page');
                enable_btn(login_btn, '授权请求失败', addLoginBtn);
            }
        });

        // 2.1 fetch token request
        const fetch_token = function() {
            clearInterval(child_close_timer);
            disable_btn(login_btn, '获取token中 ...')
            const paras = `?ticket=${LOGIN_TOKEN_TICKET}`;
            console.log(`[bgm_luck] try to dump lucky token for ${uid}, with ticket ${LOGIN_TOKEN_TICKET}`);
            $.ajax({
                timeout: 5000,
                type:'POST',
                crossDomain: true,
                contentType: 'application/json',
                url: 'https://eastasia.azure.data.mongodb-api.com/app/bgm_oauth_login-temed/endpoint/get_token' + paras,
                dataType: 'json',
                data: '{"api-key":"NgqM6Rij0CZ7hBniHJdgydcqSKUDMUSl6bhHciCXo8rk39PhPkL8VrkpEkZqDkUm"}',
                success : callback_dump,
                error : function() {
                    console.warn('[bgm_luck] invalid ticket for fetching token');
                    enable_btn(login_btn, 'token抓取失败', addLoginBtn);
                }
            });
        };

        // 2.0: no webworker, hence user needs to click after oauth
        const next_step = function() {
            enable_btn(login_btn, '已经授权? 获取token', fetch_token);
        };

        // 2.2: dump the token tailored for lucky comment
        const callback_dump = function(resp) {
            const login_info = {
                "uname" : resp.uname,
                "uid" : resp.uid,
                "token" : resp.token,
                "mark" : "这里的token是由bgm_luck数据库生成的投票依据;授权时由bgm提供的token已经被直接抛弃,没有账户泄漏风险"
            };
            console.log(`[bgm_luck] token for ${uid} is stored in localStorage as ${LUCKY_LOGIN_KEY}`);
            localStorage.setItem(LUCKY_LOGIN_KEY, JSON.stringify(login_info));
            addLogoutBtn(login_info);
        };
    });
}

