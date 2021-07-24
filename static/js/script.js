if (prefered_dark()) {
    mode_dark.checked = true;
    dark_mode(true);
}

$('.dark-mode').on('change', function(e) {
    var dark = e.target.value === 'dark';
    dark_mode(dark);
    save_dark_mode(dark);
});

let cols;
const COL_MARGIN = 30;
const char = char_size();
let cookie_consent = !!localStorage.getItem('cookie');
const [progress] = $('nav.main pre');
if (!cookie_consent) {
    display_baner('');
}
window.addEventListener('resize', resize, { passive: true });
document.addEventListener('scroll', render_progress, { passive: true });
cookie_ok.addEventListener('click', function() {
    localStorage.setItem('cookie', true);
    cookie_consent = true;
    display_baner('none');
});
pi.addEventListener('click', function(e) {
    if (e.ctrlKey && e.shiftKey) {
        matrix(m).then(() => {
            document.body.classList.remove('matrix');
        });
        document.body.classList.add('matrix');
    }
    e.preventDefault();
});

resize();
render_progress();

function render_progress() {
    const percent = get_scroll_progress(document.body);
    progress.innerHTML = string_progress(percent, cols);
}

function resize() {
    if (!cookie_consent) {
        cookie_resize();
    }
    cols = get_col_size(progress.parentNode) - COL_MARGIN;
    render_progress();
}


function display_baner(value) {
    cookie_baner.style.display = value;
}

function cookie_resize() {
    const cols = get_col_size(cookie_baner) - 2;
    const line = '+' + '-'.repeat(cols) + '+';
    cookie_baner.dataset.line = line;
}


function dark_mode(toggle) {
    document.body.dataset.mode = toggle ? 'dark' : 'light';
}

function prefered_dark() {
    var ls = localStorage.getItem('dark-mode');
    if (ls) {
        return JSON.parse(ls);
    }
    if ('matchMedia' in window) {
        var media_query = window.matchMedia('prefers-color-scheme: dark');
        return media_query.matches;
    }
    return false;
}

function save_dark_mode(mode) {
    localStorage.setItem('dark-mode', mode);
}

function $(selector) {
    var data = document.querySelectorAll(selector);
    var result = Array.from(data);
    result.on = function(event, callback) {
           data.forEach(node => {
               node.addEventListener(event, callback);
           });
    };
    return result;
}

function char_size() {
    const span = document.createElement('span');
    span.innerHTML = '&nbsp;';
    $('nav.main')[0].appendChild(span);
    var rect = span.getBoundingClientRect();
    span.remove();
    return rect;
}

function string_progress(percent, width) {
    var size = Math.round(width*percent/100);
    var left = '', taken = '', i;
    for (i=size; i--;) {
        taken += '=';
    }
    if (taken.length > 0) {
        taken = taken.replace(/=$/, '>');
    }
    for (i=width-size; i--;) {
        left += ' ';
    }
    return '[' + taken + left + '] ' + percent + '%';
}

// ref: https://stackoverflow.com/a/28994709/387194
function get_scroll_progress(elm) {
    const parent = elm.parentNode;
    const scrollTop = elm.scrollTop || parent.scrollTop;
    const height = parent.scrollHeight - parent.clientHeight;
    if (height === 0) {
        return 100;
    }
    return Math.round(scrollTop / height * 100);
}

function get_col_size(element) {
    const { width } = element.getBoundingClientRect();
    return Math.floor(width / char.width);
}
