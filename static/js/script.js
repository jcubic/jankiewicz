if (prefered_dark()) {
    mode_dark.checked = true;
    dark_mode(true);
}

$$('.dark-mode').on('change', function(e) {
    if ('vibrate' in window.navigator) {
        window.navigator.vibrate(100);
    }
    var dark = e.target.value === 'dark';
    dark_mode(dark);
    save_dark_mode(dark);
});

let cols;
const COL_MARGIN = 30;
let char = char_size();
let cookie_consent = !!localStorage.getItem('cookie');
const [progress] = $$('nav.main pre');
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
    e.preventDefault();
    if (e.ctrlKey && e.shiftKey) {
        matrix(m, { font_size: 20 }).then(() => {
            document.body.classList.remove('matrix');
        });
        if (!window.jQuery || !window.jQuery.terminal) {
            const head = document.querySelector('head');
            new_script(head, 'https://cdn.jsdelivr.net/npm/jquery');
            wait(function() {
                return typeof jQuery !== 'undefined';
            }).then(function() {
                new_script(head, 'https://cdn.jsdelivr.net/gh/jcubic/jquery.terminal@devel/js/jquery.terminal.js');
            });
            new_style(head, 'https://cdn.jsdelivr.net/npm/jquery.terminal/css/jquery.terminal.min.css');
        }
        when_ready(function($) {
            var animation;
            var term = $('.system .body').terminal(function() {
                
            }, {
                greetings: '',
                keydown: function() {
                    if (animation) {
                        return false;
                    }
                },
                prompt: '# ',
                onBlur: function() {
                    return false;
                }
            });
            $('.system .trinity-dialog').removeClass('hidden');
            ssh_hack(term);

            async function ssh_hack(term) {
                animation = true;
                // hacking sequence from Matrix Reloaded
                term.clear().echo([
                    '# nmap -v -sS -O 10.2.2.2',
                    '',
                    'Starting nmap V. 2.54BETA25',
                    'Insufficient responses for TCP sequencing (3). OS detection may be less',
                    'accurate',
                    'Interesting ports on 10.2.2.2:',
                    '(The 1539 ports scanned but not shown below are in state: closed)',
                    'Port\t\tState\t\tService\n22/tcp\t\topen\t\tssh',
                    '',
                    'No exact OS matches for host',
                    '',
                    'Nmap run completed -- 1 IP address (1 host up) scanneds'
                ].join('\n'));
                await term.typing('enter', 100, 'sshnuke 10.2.2.2 -rootpw="Z10N0101"');
                term.set_prompt('');
                async function step(msg) {
                    msg = `${msg} ...`;
                    term.echo(msg);
                    var id = term.last_index();
                    await delay(1000);
                    msg += ' successful.';
                    term.update(-1, msg);
                }
                await step('Connecting to 10.2.2.2:ssh');
                await step('Attempting to exploit SSHv1 CRC32');
                term.echo('Reset root password to "Z10N0101".');
                await delay(400);
                term.echo('System open: Access level <9>');
                term.set_prompt('# ');
                await delay(400);
                await term.typing('enter', 100, 'ssh 10.2.2.2 -l root');
                term.set_prompt('root@10.2.2.2\'s password: ');
                await delay(1000);
                term.set_prompt('RRF-CONTROL> ').echo('root@10.2.2.2\'s password: \n');
                await delay(500);
                await term.typing('enter', 100, 'disable grid nodes 21 - 48');
                term.echo('');
                term.echo('[[;#fff;]Warning: Disabling nodes 21-48 will disconnect sector 11 (27 nodes)]');
                term.set_prompt('');
                term.echo('         [[;#fff;]ARE YOU SURE? (y/n)]');
                await delay(1000);
                term.update(-1, '         [[;#fff;]ARE YOU SURE? (y/n)] y');
                term.echo('');
                await delay(200);
                for (let i = 21; i <= 48; i++) {
                    term.echo(`Grid Node ${i} offline...`);
                    await delay(200);
                }
                term.echo('\nConnection to 10.2.2.2 closed.');
                term.set_prompt('# ');
                animation = false;
            }
        });
        document.body.classList.add('matrix');
    }
});

resize();
render_progress();


function new_style(head, href) {
    var style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = href;
    head.appendChild(style);
}

function new_script(head, src) {
    const script = document.createElement('script');
    script.src = src;
    head.appendChild(script);
}

function wait(test) {
    return new Promise(function(resolve) {
        (function recur() {
            if (test()) {
                resolve();
            } else {
                setTimeout(recur, 100);
            }
        })();
    });
}

function when_ready(fn) {
    wait(function() {
        return typeof jQuery !== 'undefined' && jQuery.terminal;
    }).then(function() {
        fn(jQuery.noConflict(true));
    });
}

function delay(timeout) {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}

function render_progress() {
    const percent = get_scroll_progress(document.body);
    progress.innerHTML = string_progress(percent, cols);
}

function resize() {
    char = char_size();
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
    cookie_baner.style.right = 0;
    const cols = get_col_size(cookie_baner) - 2;
    const line = '+' + '-'.repeat(cols) + '+';
    cookie_baner.dataset.line = line;
    cookie_baner.style.removeProperty('right');
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

function $$(selector) {
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
    $$('nav.main')[0].appendChild(span);
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
