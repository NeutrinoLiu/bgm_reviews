addStyle();
const LIKE_HOLLOW = `
    <svg xmlns="http://www.w3.org/2000/svg" height="1.7em" viewBox="-20 -20 550 550">
    <path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"/>
    </svg>`;
const LIKE_FILLED = `
    <svg xmlns="http://www.w3.org/2000/svg" height="1.7em" viewBox="-20 -20 550 550" id=like_beating>
    <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/>
    </svg>`;
const mpopup = initPopup();
let box = document.querySelector('.lucky_popup');

const ucont = document.getElementById('memberUserList'); // collections 页面
const blist = document.getElementById('browserItemList'); // 用户收藏页
const cbox = document.getElementById('comment_box');    // 吐槽箱
if (ucont) bindComments(mpopup, ucont.getElementsByClassName('userContainer'), selector, parser);
if (blist) bindComments(mpopup, blist.getElementsByClassName('inner'), selector, parser);
if (cbox) bindComments(mpopup, cbox.getElementsByClassName('item'), selector, parser);

function selector(ele) {
    return ele;
}

function parser(ele) {
    return null;
}

function addStyle() {
    const style = document.createElement('style');
    style.innerHTML = `
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

function initPopup() {
    const popupHtml = `
    <div class="lucky_popup">
        <div class="lucky_popup_inner">
            <div class="lucky_popup_icon">${LIKE_HOLLOW}</div>
            <p hidden></p>
        </div></div>`;
    $('.mainWrapper').append(popupHtml);
    return $('.lucky_popup');
}

function Likers() {
    return '徒手开根号二 等也点赞了该短评';
}

function resetLink(ppup, ele, parser) {
    ppup.find('.lucky_popup_icon').html(LIKE_HOLLOW);
    ppup.find('p').html('');
    ppup.find('p').hide();
    ppup.unbind();
    ppup.on('click', function(){
        ppup.find('.lucky_popup_icon').html(LIKE_FILLED);
        ppup.find('p').html(Likers());
        ppup.find('p').show();
    });
}

function bindComments(ppup, list, selector, parser) {
    for (let l of list) {
        let ele = selector(l)
        let info = parser(l)
        ele.style.cursor = 'pointer';
        ele.onclick = function (e) {
            if (ele == ppup.lucky_parent) {
                ppup.fadeOut();
                ppup.lucky_parent = null;
            } else {
                ppup.hide()
                resetLink(ppup, ele, parser);
                ppup.css({left: e.pageX-20});
                ppup.css({top: e.pageY-35});
                ppup.fadeIn();
                ppup.lucky_parent = ele;
            }
        };
    }
}