function addStyle() {
    const style = document.createElement('style');
    style.innerHTML = `
    :target {
        animation: target-fade 1s;
    }
    @keyframes target-fade {
        from { background-color: red; } 
        to { background-color: transparent; }
    }
    .lucky_popup {
        -moz-border-radius: 8px;
        -webkit-border-radius: 8px;
        border-radius: 8px;
        -moz-box-shadow: inset 0 1px 1px hsla(0, 0%, 100%, 0.3), inset 0 -1px 0 hsla(0, 0%, 100%, 0.1), 0 2px 4px hsla(0, 0%, 0%, 0.2);
        -webkit-box-shadow: inset 0 1px 1px hsla(0, 0%, 100%, 0.3), inset 0 -1px 0 hsla(0, 0%, 100%, 0.1), 0 2px 4px hsla(0, 0%, 0%, 0.2);
        box-shadow: inset 0 1px 1px hsla(0, 0%, 100%, 0.3), inset 0 -1px 0 hsla(0, 0%, 100%, 0.1), 0 2px 4px hsla(0, 0%, 0%, 0.2);
        backdrop-filter: blur(20px) contrast(95%);
        -webkit-backdrop-filter: blur(20px) contrast(95%);
        z-index: 10;
        display: none;
        position: absolute;
        text-align: left;
        border: 1px solid #d8d8d8;
        background: rgba(255, 255, 255, 0.7);
        cursor: default;
        transition: background 0.5s ease;
    }
    .lucky_popup:hover {
        background: rgba(255, 255, 255, 0.1);
    }
    html[data-theme='dark'] .lucky_popup {
        border: 1px solid #474747;
        background: rgba(50,50,50,0.8);
    }
    html[data-theme='dark'] .lucky_popup:hover {
        background: rgba(50,50,50,0.1);
    }
    .lucky_popup_inner {
        display: table;
        padding: 2px;
     }
    .lucky_popup_icon {
        display: table-cell;
        vertical-align: middle;
        padding: 5px 5px 0px 5px;
    }
    .lucky_popup svg {
        cursor: pointer;
    }
    .lucky_popup svg path {
        fill: #666666;
    }
    html[data-theme='dark'] .lucky_popup svg path {
        fill: #d8d8d8;
    }
    .lucky_popup p {
        padding: 2px 6px 0px 0px;
        display: table-cell;
        vertical-align: middle;
        font-size: 1em;
        font-weight: 500;
        color: #666666;
    }
    html[data-theme='dark'] .lucky_popup p {
        color: #d8d8d8;
    }
    #like_beating {
        animation: heartbeat 1s linear;
    }
    @keyframes heartbeat
    {
      0%
      {
        transform: scale( 1. );
      }
      50%
      {
        transform: scale( 1.2 );
      }
      100%
      {
        transform: scale( 1. );
      }
    }
    `;
    document.head.appendChild(style);
}
addStyle();

// comment likes function related ==============================

const LIKE_HOLLOW = `
    <svg xmlns="http://www.w3.org/2000/svg" height="1.7em" viewBox="-20 -20 550 550">
    <path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"/>
    </svg>`;
const LIKE_FILLED = `
    <svg xmlns="http://www.w3.org/2000/svg" height="1.7em" viewBox="-20 -20 550 550" id=like_beating>
    <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/>
    </svg>`;
hookPopup();


function hookPopup() {
    // ** utils **
    const get_sid_from_url = function() {
        return location.pathname.split('subject/')[1].split('/')[0];
    }
    const get_uid_from_url = function() {
        return location.pathname.split('list/')[1].split('/')[0];
    }
    const date_digest = function (ts) {
        if (ts.includes('ago'))
            return new Date().toLocaleDateString("zh-Hans-CN");
        else return ts.replace('@ ', '').split(' ')[0]
    }
    const get_star = function (ele) {
        if (ele.length)
            return Number(ele.attr('class').split(' ')[1].replace('stars',''));
        else return 0;
    }
    const trimSpace = function (ele) {
        if (! ele) return ele;
        return ele.replaceAll('\n', ' ').replaceAll('\t', ' ').trimStart();
    }
    //
    const cbox_selector = function(ele) {
        return $(ele).find('p');
    }
    const ucont_selector = function(ele) {
        return $(ele);
    }
    const blist_selector = function(ele) {
        return $(ele).find('div.text');
    }
    const cbox_parser = function(ele) {
        const ret = {
            uid: $(ele).find('a').attr('href').split('/').slice(-1)[0],
            sid: get_sid_from_url(),
            date: date_digest($(ele).find('small.grey').text()),
            stars: get_star($(ele).find('.starlight')),
            content: trimSpace($(ele).find('p').text())
        }
        return ret;
    }
    const ucont_parser = function(ele) {
        const ret = {
            uid: $(ele).find('a').attr('href').split('/').slice(-1)[0],
            sid: get_sid_from_url(),
            date: date_digest($(ele).find('p.info').text()),
            stars: get_star($(ele).find('.starlight')),
            content: trimSpace($(ele).html().split('</p>')[1].split('</div>')[0])
        }
        return ret;
    }
    const blist_parser = function(ele) {
        const ret = {
            uid: get_uid_from_url(),
            sid: $(ele).find('a').attr('href').split('/').slice(-1)[0],
            date: $(ele).find('span.tip_j').text(),
            stars: get_star($(ele).find('.starlight')),
            content: trimSpace($(ele).find('div.text').text())
        }
        return ret;
    }

    const popup_raw = `
    <div class="lucky_popup">
        <div class="lucky_popup_inner">
            <div class="lucky_popup_icon">${LIKE_HOLLOW}</div>
            <p hidden></p>
        </div></div>`;
    $('body.bangumi').append(popup_raw);

    const mpopup = $('.lucky_popup');

    const ucont = $('#memberUserList'); // collections 页面
    if (ucont.length) bindComments(mpopup, ucont.find('div.userContainer'), ucont_selector, ucont_parser);

    const blist = $('div.mainWrapper').find('#browserItemList'); // 用户收藏页
    if (blist.length) bindComments(mpopup, blist.find('li.item'), blist_selector, blist_parser);

    const cbox = $('#columnSubjectHomeB').find('#comment_box');    // 吐槽箱
    if (cbox.length) bindComments(mpopup, cbox.find('div.text'), cbox_selector, cbox_parser);
}

function getIdentity() {
    return JSON.parse(localStorage.getItem(LUCKY_LOGIN_KEY));
}

function send_like(cmt, ppup) {
    const id_token = getIdentity();
    if (! id_token) {
        ppup.find('.lucky_popup_icon').html(LIKE_HOLLOW);
        ppup.find('p').html(`<a href="https://${location.host}/#lucky_login_panel">请先在主页授权</a>`);
        ppup.find('p').fadeIn();
    } else {
        const post_data = {
            liker: id_token.uid,
            token: id_token.token,
            detail: cmt.info,
        }
        // console.log(post_data);
        $.ajax({
            timeout: 5000,
            type:'POST',
            crossDomain: true,
            contentType: 'application/json',
            url: 'https://eastasia.azure.data.mongodb-api.com/app/luckyreviewany-rclim/endpoint/like_reivew',
            dataType: 'json',
            data: JSON.stringify(post_data),
            success : function(resp) {
                cmt.status.liked = resp.like_succeed >= 0;
                cmt.status.likers = resp.likers;
                cmt.status.nlikers = resp.nlikers;
                show_status(cmt, ppup, resp.like_succeed == 0);
            },
            error : function() {
                console.warn('[bgm_luck] like fails');
                ppup.find('.lucky_popup_icon').html(LIKE_HOLLOW);
                ppup.find('p').html('点赞失败');
                ppup.find('p').fadeIn();
            }
        });
    }
}

function show_status(cmt, ppup, duplicate=false) {
    if (cmt != ppup.master) {
        return;
    }
    const cmt_href = cmt.status.likers.slice(0,5).map(function(liker){
        return `<a href="/user/${liker}" target="_blank">${liker}</a>`;
    });
    if (duplicate) {
        ppup.find('p').html(`你已喜欢该短评`);
        ppup.find('p').fadeIn();
        ppup.timeout = setTimeout(function(){
            ppup.find('p').hide();
            ppup.find('p').html(`${cmt_href.join('、')} 等${cmt.status.nlikers}位bgmer喜欢了该短评`);
            ppup.find('p').fadeIn();
        }, 1000);
    } else {
        ppup.find('p').html(`${cmt_href.join('、')} 等${cmt.status.nlikers}位bgmer喜欢了该短评`);
        ppup.find('p').fadeIn();
    }
}

function ppupRefill(cmt, ppup) {
    ppup.master = cmt;
    ppup.unbind();
    if (cmt.status.liked) {
        ppup.find('.lucky_popup_icon').html(LIKE_FILLED);
        show_status(cmt, ppup);
    } else {
        ppup.find('.lucky_popup_icon').html(LIKE_HOLLOW);
        ppup.find('p').html('');
        ppup.find('p').hide();
        ppup.on('click', function(){
            ppup.find('.lucky_popup_icon').html(LIKE_FILLED);
            ppup.unbind()
            send_like(cmt, ppup);
        });
    }
}

function bindComments(ppup, list, selector, parser) {
    list.each( function() {
        const ele = this;
        ele.info = parser(ele);
        let clickable = selector(ele);
        if (clickable.length && ele.info.content && ele.info.content != '') {
            ele.status = {
                liked: false,
                likers: [],
                nlikers: -1,
            };
            clickable.css('cursor', 'pointer');
            clickable.on('click', function (e) {
                if (ppup.last_time_click == ele) {
                    ppup.fadeOut();
                    ppup.last_time_click = null;
                } else {
                    ppup.hide()
                    ppupRefill(ele, ppup);
                    ppup.css({left: e.pageX-20});
                    ppup.css({top: e.pageY-40});
                    ppup.fadeIn();
                    ppup.last_time_click = ele;
                }
            });
        }
    });
}

// log-in related logic =============================

const LUCKY_LOGIN_KEY = "BGM_LUCKY_LOGIN";
const LOGIN_APPKEY = 'eyJhcGkta2V5IjoiTmdxTTZSaWowQ1o3aEJuaUhKZGd5ZGNxU0tVRE1VU2w2YmhIY2lDWG84cmszOVBoUGtMOFZya3BFa1pxRGtVbSJ9';
var LOGIN_TOKEN_TICKET = null;
addLoginPanel();

function getUid() {
    const user = $('.idBadgerNeue').find('a.avatar');
    let uid = user.attr('href').split('/');
    uid = uid[uid.length -1];
    return uid;
}

function disable_btn(btn, prompt) {
    btn.css('cursor', 'default');
    btn.css('background', 'grey');
    btn.html(prompt);
    btn.removeAttr('href');
    btn.removeAttr('target');
    btn.unbind();
}

function enable_btn(btn, prompt, func) {
    btn.css('cursor', 'pointer');
    btn.css('background', '');
    btn.html(prompt);
    btn.unbind();
    btn.removeAttr('href');
    btn.removeAttr('target');
    btn.on('click', func);
}

function addLoginPanel() {
    const loginPanel = `
        <div id="lucky_login_panel" class="ui-draggable">
            <div class="sidePanelHome">
            <h2 class="subtitle" style="cursor:pointer;">Feeling Lucky 设置</h2>
            <ul class="timeline" style="margin: 0px 5px; display: block;">
                <li id="lucky_login_status"></li>
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
            login_btn.html('没有弹出页？手动点击');
            login_btn.attr('href', resp.oauth_url);
            login_btn.attr('target', '_blank');
            LOGIN_TOKEN_TICKET = resp.ticket;
            console.log(`[bgm_luck] fetched ticket ${LOGIN_TOKEN_TICKET} for ${uid}`);
            // setTimeout( function() {
            const child = window.open(resp.oauth_url, "","width=550,height=550,toolbar=0,status=0,");
            login_btn.
            callback_timeout = setTimeout(next_step, 5000) // enable manual toggle after 3s
            child_close_timer = setInterval(function() {           // detect child close 
                if(child.closed) {
                    clearInterval(child_close_timer);
                    clearTimeout(callback_timeout);
                    console.log('[bgm_luck] pop up closed');
                    fetch_token();
                }
            }, 500);
            // }, 1);
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
            data: atob(LOGIN_APPKEY),
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
                data: atob(LOGIN_APPKEY),
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

// add new timeline ===================
addTimelineReview();
function addTimelineReview() {
    const review_tl_raw = '<li><a id="tab_lucky_review" href="javascript:;">短评</a></li>'
    $('#timelineTabs > li:nth-child(2)').after(review_tl_raw);
    const tab_review_btn = $('#tab_lucky_review');
    tab_review_btn.css('cursor', 'pointer');
    tab_review_btn.on('click', showReviewTimeline);
}

function showReviewTimeline(){
    const tab_review_btn = $('#tab_lucky_review');
    const tml_content = $('#tmlContent');
    $('#timelineTabs').find('a').each(
        function (){
            const cls = $(this).attr('class');
            if (cls) $(this).attr('class', cls.replace('focus',''));
        });
    tab_review_btn.attr('class', 'focus');
    tml_content.html('<div class="loading"><img src="/img/loadingAnimation.gif"></div>');

    const url_reviews = 'https://eastasia.azure.data.mongodb-api.com/app/luckyreviewany-rclim/endpoint/recent_likes?sort=time&n=10';
    let ajax_req = {
        timeout: 10000,
        crossDomain: true,
        contentType: 'application/json',
        type: 'GET',
        url: url_reviews,
        success: function(resp) {
            tml_content.html(`
            <div id="timeline">
                <h4 class="Header">
                <a id="refresh_header">刷新</a> | 
                <a href="https://neutrinoliu.github.io/bgm_reviews/" target="_blank">Feeling Lucky Waterfall</a>
                </h4>
                <ul>${buildTmlItems(resp)}</ul>
            </div>`)
            tml_content.find('#refresh_header').on('click', showReviewTimeline);
            tml_content.find('#refresh_header').css('cursor', 'pointer');
            refillTmlItems(resp);
        },
        error: function() {
            tml_content.html('<div class="loading"><h2>服务器正在ICU抢救中 ... </h2></div>')
        }
    };
    $.ajax(ajax_req);
}

function refillTmlItems(records) {
    const ppup = $('.lucky_popup');
    records.forEach(function (r){
        // console.log(r);
        const li_ele = $(`#${r.id}`);
        $.ajax({
            timeout: 2000,
            contentType: 'application/json',
            type: 'GET',
            url: `https://api.bgm.tv/v0/users/${r.uid}`,
            success: function(resp) {
                li_ele.find("a.likee_id").html(resp.nickname);
                li_ele.find("span.likee_img").css('background-image', `url('${resp.avatar.large}')`);
            },
            error: function(resp) {
                // console.warn("[bgm_luck] bangumi api fails");
            }
        });
        // $.ajax({
        //     timeout: 2000,
        //     contentType: 'application/json',
        //     type: 'GET',
        //     url: `https://api.bgm.tv/v0/users/${r.last_liker}`,
        //     success: function(resp) {
        //         li_ele.find("a.liker_id").html(resp.nickname);
        //     },
        //     error: function(resp) {
        //         // console.warn("[bgm_luck] bangumi api fails");
        //     }
        // });
        $.ajax({
            timeout: 2000,
            contentType: 'application/json',
            type: 'GET',
            url: `https://api.bgm.tv/v0/subjects/${r.sid}`,
            success: function(resp) {
                li_ele.find("a.subject_id").html(resp.name);
                li_ele.find("img.subject_img").attr('src', resp.images.grid.replace('100','100x100'));
            },
            error: function(resp) {
                // console.warn("[bgm_luck] bangumi api fails");
            }
        });
        
        // bind btns
        li_ele.info = {
            uid: r.uid,
            sid: r.sid
        }
        let clickable = li_ele.find('div.quote');
        if (clickable.length) {
            li_ele.status = {
                liked: false,
                likers: [],
                nlikers: -1,
            };
            clickable.css('cursor', 'pointer');
            clickable.on('click', function (e) {
                if (ppup.last_time_click == li_ele) {
                    ppup.fadeOut();
                    ppup.last_time_click = null;
                } else {
                    ppup.hide()
                    ppupRefill(li_ele, ppup);
                    ppup.css({left: e.pageX-20});
                    ppup.css({top: e.pageY-40});
                    ppup.fadeIn();
                    ppup.last_time_click = li_ele;
                }
            });
        }

    });
}

function buildTmlItems(records) {
    const li_eles = records.map(
        function(r) {
            const user_img = '//lain.bgm.tv/pic/user/l/icon.jpg';
            const span_avatar_image = `<span class="avatarNeue avatarReSize40 ll likee_img" style="background-image:url('${user_img}')"></span>`;
            const span_avatar = `<span class="avatar"><a href="/user/${r.uid}" class="avatar">${span_avatar_image}</a></span>`;

            const subject_img = '/img/no_img.gif';
            const span_subject = `<a href="/subject/${r.sid}"><img src="${subject_img}" alt class="rr subject_img" width="48"></a>`;
            // const liker_name = `<a href="/user/${r.last_liker}" class="l liker_id">${r.last_liker}</a>`;
            const liker_name = `${r.likes} 位bgmer`
            const likee_name = `<a href="/user/${r.uid}" class="l likee_id">${r.uid}</a>`;
            const subject_name = `<a href="/user/${r.sid}" class="l subject_id">${r.sid}</a>`;
            const collect_info = `<div class="collectInfo"><div class="quote"><q>${r.comment}</q></div></div>`
            const time_stamp = `<p class="date">${relativeTime(Date.parse(r.time))}</p>`

            const span_info = `<span class="info clearit">${span_subject}${liker_name} 喜欢了 ${likee_name} 对 ${subject_name} 的短评: ${collect_info} ${time_stamp}</span>`
            const li = `<li id=${r.id} class="clearit tml_item"> ${span_avatar} ${span_info} </li>`
            return li
        }
    )
    return li_eles.join('');
}

function relativeTime(date) {
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;

    var elapsed = new Date() - date;

    if (elapsed < msPerMinute) 
         return '刚刚';   
    else if (elapsed < msPerHour) 
         return Math.round(elapsed/msPerMinute) + '分钟前';   
    else if (elapsed < msPerDay ) 
         return Math.round(elapsed/msPerHour ) + '小时前';   
    else return `${date.toLocaleDateString('zh-Hans-CN')}`
}