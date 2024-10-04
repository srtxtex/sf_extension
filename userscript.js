// ==UserScript==
// @name         SF extension
// @version      1.3
// @description  SF extension
// @author       VirtusTex
// @license      GPL-3.0 license
// @grant        GM_xmlhttpRequest
// @include https://apps.skillfactory.ru/*
// @include https://lms.skillfactory.ru/*
// @downloadURL https://raw.githubusercontent.com/srtxtex/sf_extension/main/userscript.js
// @updateURL https://raw.githubusercontent.com/srtxtex/sf_extension/main/userscript.js
// ==/UserScript==

const delay = 700;

const hostname = {
    apps: 'apps.skillfactory.ru',
    lms: 'lms.skillfactory.ru',
};

const pathname = {
    home: '/home',
    progress: '/progress',
    sequentialBlock: '@sequential+block',
    verticalBlock: '/xblock',
};

class Utils {
    static isEmptyObject(obj) {
        return Object.keys(obj).length === 0;
    }
}

class Router {
    document
    location

    constructor(document) {
        this.document = document;
        this.location = document.location;
    }

    async route(params) {
        console.log('route', params)
        params.forEach(async (param) => {
            if (param.host === this.location.host && this.location.pathname.includes(param.path)) {
                console.log('handler', param)
                await param.handler();
            }
        });
    }
}

async function handlerHomePage() {
    const timerId = setInterval(() => {
        const nav = document.getElementsByClassName('sf-course-menu sf-outline-page__course-menu');
        if (Boolean(nav.length)) {
            clearInterval(timerId);
            start();
        }
    }, 100);

    function start() {
        const data = {
            '1': ['I. Операционная система Linux', 'I. Программирование на Python', 'I. Business English. Начинающие', 'I. Business English. Продолжающие', 'I. Программная инженерия. Часть I', 'I. Математические основы анализа данных. Часть I', 'I. Математические основы машинного обучения. Часть I', 'I. Цифровые компетенции в научной деятельности', 'I. Проектный практикум'],
            '2': ['II. Основы SQL', 'II. Научный английский', 'II. Углубленное программирование на Python', 'II. Автоматизация администрирования MLOps', 'II. Программная инженерия. Часть II', 'II. Математические основы машинного обучения. Часть II', 'II. Математические основы анализа данных. Часть II', 'II. Глубокие нейронные сети на Python', 'II. Проектный практикум 2', 'II. Научный английский. Начинающие', 'II. Научный английский. Продолжающие'],
            '3': ['III. Автоматизация администрирования MLOps II', 'III. Управление проектами', 'III. Математические основы машинного обучения. Обработка естественного языка', 'III. Математические основы машинного обучение. Компьютерное зрение', 'III. Математические основы машинного обучения. Временные ряды', 'III. Хранение, извлечение и обработка больших данных', 'III. Разработка систем анализа больших данных', 'III. Этика искусственного интеллекта', 'III. Бизнес-применение машинного обучения', 'III. Проектный практикум 3'],
            //'Адаптационный блок', 'Выравнивающий курс по математике', 'Записи встреч (организационные, внеучебные)', 
        }
        const Pathname = {
            Home: '/learning/course/course-v1:Skillfactory+URFUML2023+SEP2023/home',
        }

        document.querySelector('div.sf-outline-page__outline-container > nav > a:nth-child(1)')?.addEventListener('click', e => {
            const active = e.target.classList.contains('sf-course-tabs__tab--active');
            if (!active) {
                const timerId = setInterval(() => {
                    const nav = document.getElementsByClassName('sf-course-menu sf-outline-page__course-menu');
                    if (Boolean(nav.length)) {
                        clearInterval(timerId);
                        remakeNav();
                    }
                }, 100);
            }
        });

        function remakeNav() {
            const [nav] = document.getElementsByClassName('sf-course-menu sf-outline-page__course-menu');
            nav.style.flex = "0 0 536px";
            const ul = nav.firstChild;
            const buttonsLinks = {};
            for (let li of ul.children) {
                const name = li.innerText;
                buttonsLinks[name] = li;
            }
            let buttonList = [];
            function createBullet(name) {
                const bullet = document.createElement('div');
                bullet.style.padding = '20px';
                bullet.style.cursor = 'pointer';
                bullet.classList.add('sf-course-menu__item');
                bullet.innerHTML = `<span>></span>&nbsp;&nbsp;${name}`;
                bullet.childNodes[0].style.transform = "rotate(90deg)"
                return bullet;
            }
            const bullet = createBullet(`Неотсортированное`);
            nav.insertAdjacentElement('afterbegin', bullet);
            bullet.onclick = function () {
                const ul = this.nextElementSibling;
                const display = ul.style.display;
                ul.style.display = Boolean(display) ? '' : 'none';
                console.log(this)
                Boolean(display) ? this.childNodes[0].style.transform = "rotate(90deg)" : this.childNodes[0].style.transform = "rotate(0deg)";
            }
            Object.keys(data).forEach(semesterNumber => {
                const disciplines = data[semesterNumber];
                const cloneUl = ul.cloneNode(true);
                const bullet = createBullet(`${semesterNumber} Семестр`);
                nav.insertAdjacentElement('afterbegin', cloneUl);
                nav.insertAdjacentElement('afterbegin', bullet);
                const list = cloneUl.childNodes;
                list.forEach(item => {
                    const discipline = item.innerText;
                    item.style.padding = "15px 24px";
                    if (!disciplines.includes(discipline)) {
                        item.style.display = 'none';
                        //item.remove();
                    }
                });
                bullet.onclick = function () {
                    const ul = this.nextElementSibling;
                    const display = ul.style.display;
                    ul.style.display = Boolean(display) ? '' : 'none';
                    Boolean(display) ? this.childNodes[0].style.transform = "rotate(90deg)" : this.childNodes[0].style.transform = "rotate(0deg)";
                }
                buttonList = [...buttonList, ...cloneUl.children];
            });

            for (let li of buttonList) {
                li.onclick = function () {
                    for (let el of buttonList) {
                        el.classList.remove('sf-course-menu__item--selected');
                    }
                    this.classList.add('sf-course-menu__item--selected');
                    const name = this.innerText;
                    buttonsLinks[name].click();
                }
            }

            let disciplines = [];
            Object.keys(data).forEach(semesterNumber => {
                disciplines = [...disciplines, ...data[semesterNumber]];
            });

            ul.childNodes.forEach(item => {
                const discipline = item.innerText;
                item.style.padding = "15px 24px";
                if (disciplines.includes(discipline)) {
                    item.style.display = 'none';
                    //item.remove();
                }
            });
        }

        if (location.pathname === Pathname.Home) {
            setTimeout(remakeNav, 1000);
        }
    }
}

async function handlerProgressPage() {
    const timerId = setInterval(() => {
        const nav = document.getElementsByClassName('sf-progress-tab__detailed-grades-container');
        const loader = document.querySelector('.outline-header__loader-container');
        //console.log('handlerProgressPage', loader)
        if (!Boolean(loader)) {//nav.length
            //console.log('handlerProgressPage false ', loader)
            clearInterval(timerId);
            // setTimeout(start, 2000)
            start();
        }
    }, 100);

    function start() {

        const data = {
            '1': ['I. Операционная система Linux', 'I. Программирование на Python', 'I. Business English. Начинающие', 'I. Business English. Продолжающие', 'I. Программная инженерия. Часть I', 'I. Математические основы анализа данных. Часть I', 'I. Математические основы машинного обучения. Часть I', 'I. Цифровые компетенции в научной деятельности', 'I. Проектный практикум'],
            '2': ['II. Основы SQL', 'II. Научный английский', 'II. Углубленное программирование на Python', 'II. Автоматизация администрирования MLOps', 'II. Программная инженерия. Часть II', 'II. Математические основы машинного обучения. Часть II', 'II. Математические основы анализа данных. Часть II', 'II. Глубокие нейронные сети на Python', 'II. Проектный практикум 2', 'II. Научный английский. Начинающие', 'II. Научный английский. Продолжающие'],
            //'Адаптационный блок', 'Выравнивающий курс по математике', 'Записи встреч (организационные, внеучебные)', 
        }
        const Pathname = {
            Progress: '/learning/course/course-v1:Skillfactory+URFUML2023+SEP2023/progress',
        }

        console.log('start')

        document.querySelector('div.sf-outline-page__outline-container > nav > a:nth-child(2)')?.addEventListener('click', e => {
            const active = e.target.classList.contains('sf-course-tabs__tab--active');
            if (!active) {
                const timerId = setInterval(() => {
                    const nav = document.getElementsByClassName('sf-progress-tab__detailed-grades-container');
                    if (Boolean(nav.length)) {
                        clearInterval(timerId);
                        document.body.style.zoom = 0.01;
                        document.getElementById('root').style.height = '10000vh';
                        setTimeout(() => {
                            document.body.style.zoom = 1;
                            document.getElementById('root').style.height = '100vh';
                            remakeNav()
                        }, 1000);
                    }
                }, 100);
            }
        });

        function remakeNav() {
            console.log('remakeNav')

            const [nav] = document.getElementsByClassName('sf-progress-tab__detailed-grades-container');
            console.log(nav)
            nav.firstElementChild.remove();
            // nav.style.flex = "0 0 536px";

            const ul = nav;//nav.firstChild;
            const buttonsLinks = {};
            for (let elem of nav.children) {
                if (elem.tagName !== "DIV") continue;
                const name = elem?.firstElementChild?.innerText;
                buttonsLinks[name] = elem;
            }
            let buttonList = [];

            function createBullet(name) {
                const bullet = document.createElement('div');
                bullet.style.padding = '20px';
                bullet.style.cursor = 'pointer';
                bullet.style.fontSize = '32px';
                bullet.classList.add('sf-module-table');
                bullet.classList.add('my_bullet');
                bullet.innerHTML = `&nbsp;&nbsp;${name}`;
                // bullet.innerHTML = `<span>></span>&nbsp;&nbsp;${name}`;
                // bullet.childNodes[0].style.transform = "rotate(90deg)"
                return bullet;
            }

            const bullet = createBullet(`Неотсортированное`);
            nav.insertAdjacentElement('afterbegin', bullet);

            bullet.onclick = function () {
                const ul = this.nextElementSibling;
                const display = ul.style.display;
                ul.style.display = Boolean(display) ? '' : 'none';
                console.log(this)
                // Boolean(display) ? this.childNodes[0].style.transform = "rotate(90deg)" : this.childNodes[0].style.transform = "rotate(0deg)";
            }

            Object.keys(data).forEach(semesterNumber => {
                const disciplines = data[semesterNumber];
                const cloneUl = ul.cloneNode(true);
                const bulletName = `${semesterNumber} Семестр`;
                const bullet = createBullet(bulletName);

                nav.insertAdjacentElement('afterbegin', cloneUl);
                nav.insertAdjacentElement('afterbegin', bullet);

                const list = cloneUl.childNodes;

                const totalCount = {
                    current: 0,
                    total: 0,
                }

                list.forEach(item => {
                    const discipline = item?.firstElementChild?.innerText;
                    // item.style.padding = "15px 24px";
                    item.style.paddingBottom = '5px';
                    item.style.marginBottom = '5px'

                    if (!disciplines.includes(discipline)) {
                        item.style.display = 'none';
                        //item.remove();
                    } else {
                        const count = {
                            other: {
                                current: 0,
                                total: 0,
                            },
                            vo: {
                                current: 0,
                                total: 0,
                            }
                        };

                        item.classList.add('my_hidden');
                        item.childNodes.forEach(div => {
                            if (div.tagName !== "DIV") return;
                            div.style.display = 'none';

                            if (!div.classList.contains('sf-module-table__module')) return;

                            const name = div.querySelector('.sf-module-lazy-dropdown__name').innerText; //МОМО. Домашнее задание №1 (vo_HW)
                            const grade = div.querySelector('.sf-module-lazy-dropdown__grade').innerText; //'-/-'

                            if (grade !== '-/-') {
                                const [current, total] = grade.trim().split('/').map(parseFloat);

                                if (name.includes('(vo_')) {
                                    count.vo.current += current;
                                    count.vo.total += total;
                                } else {
                                    count.other.current += current;
                                    count.other.total += total;
                                }
                            }
                        });

                        let percent = (count.other.current + count.vo.current) / (count.other.total + count.vo.total) * 100;
                        if (isNaN(percent)) percent = 100;
                        //const countString = `(test: ${count.other.current}/${count.other.total}, hw: ${count.vo.current}/${count.vo.total}) ${percent.toFixed(2)}%`; //${}
                        const countString = `   (${count.other.current + count.vo.current}/${count.other.total + count.vo.total},  ${percent.toFixed(2)}%)`; //${}

                        // if (isNaN(percent)) console.log(count);

                        totalCount.current += count.other.current + count.vo.current;
                        totalCount.total += count.other.total + count.vo.total;
                        // console.log('discipline', discipline, countString);

                        item.firstElementChild.innerText += '   ' + countString;

                        const fc = item?.firstElementChild;
                        fc.onclick = function (e) {
                            //console.log('item.onclick', e)
                            const cont = e.target.parentElement;
                            if (cont.classList.contains('my_hidden')) {
                                cont.classList.remove('my_hidden');
                                cont.childNodes.forEach(div => {
                                    if (div.tagName !== "DIV") return;
                                    div.style.display = '';
                                })
                            } else {
                                cont.classList.add('my_hidden');
                                cont.childNodes.forEach(div => {
                                    if (div.tagName !== "DIV") return;
                                    div.style.display = 'none';
                                })
                            }
                        }
                    }
                });


                nav.querySelectorAll('.my_bullet').forEach(bullet => {
                    if (bullet.innerText.trim() === bulletName) {
                        const percent = totalCount.current / totalCount.total * 100;
                        // console.log('bullet.innerText', bulletName, percent)
                        bullet.innerText += `   (${totalCount.current}/${totalCount.total},  ${percent.toFixed(2)}%)`
                    }
                })

                bullet.onclick = function () {
                    const ul = this.nextElementSibling;
                    const display = ul.style.display;
                    ul.style.display = Boolean(display) ? '' : 'none';
                    // Boolean(display) ? this.childNodes[0].style.transform = "rotate(90deg)" : this.childNodes[0].style.transform = "rotate(0deg)";
                }
                buttonList = [...buttonList, ...cloneUl.children];
            });




            // for (let li of buttonList) {
            //     li.onclick = function () {
            //         for (let el of buttonList) {
            //             el.classList.remove('sf-course-menu__item--selected');
            //         }
            //         this.classList.add('sf-course-menu__item--selected');
            //         const name = this.innerText;
            //         buttonsLinks[name].click();
            //     }
            // }

            let disciplines = [];
            Object.keys(data).forEach(semesterNumber => {
                disciplines = [...disciplines, ...data[semesterNumber]];
            });

            nav.childNodes.forEach(item => {
                const discipline = item?.firstElementChild?.innerText;
                // item.style.padding = "15px 24px";
                if (disciplines?.includes(discipline)) {
                    item.style.display = 'none';
                    //item.remove();
                }
            });
        }

        if (location.pathname === Pathname.Progress) {
            document.body.style.zoom = 0.01;
            document.getElementById('root').style.height = '10000vh';
            setTimeout(() => {
                document.body.style.zoom = 1;
                document.getElementById('root').style.height = '100vh';
                setTimeout(remakeNav, 5000);
            }, 1000);
            // setTimeout(remakeNav, 2000);
        }
    }
}

function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min
}

const router = new Router(document);

const pageType = {
    lms: 'lms.',
    apps: 'apps.',
}

const directoryType = {
    verticalBlocks: 'verticalBlocks',
}

const validatedType = {
    wasValidetedFull: 'wasValidetedFull',
    wasValidetedPartially: 'wasValidetedPartially',
}

class Page {
    document
    location
    type
    verticalBlock
    store
    data = {}
    status = {}
    classes = {
        correct: 'correct',
        incorrect: 'incorrect',
        partiallyCorrect: 'partiallyCorrect',
    }

    constructor(document) {
        this.document = document;
        this.location = document.location;
        this.type = this.getType();//TODO переделать на app или что то еще 
        this.verticalBlock = this.getVerticalBlock();
        console.log('Page', this);
    }

    async init(store) {
        this.store = store;

        if (this.type === pageType.apps) {
            /*

            */

        } else if (this.type === pageType.lms) {
            /*
            сканируем страницу, получаем данные, навешиваем обработчики
            проверяем данные  
            //перед тем как отправялть сверить со стором с сервера, есть ли новые правильные ответы          
            */


            const directory = directoryType.verticalBlocks;
            const data = this.loadDataFromStore(directory);
            this.data = { ...data };
            const pageData = this.initPage();
            await this.compareData(pageData);

            const min = 2 * 60 * 1000;
            const max = 4 * 60 * 1000;

            setInterval(async () => {
                const block = this.getVerticalBlock();
                const directory = directoryType.verticalBlocks;
                // await this.store.savePage(this.data, directory, block);
                await this.store.fetchStore(directory, block)



                // const directory = directoryType.verticalBlocks;
                const data = this.loadDataFromStore(directory);
                this.data = { ...data };
                console.log('setInterval data', data)

                this.addToggles();
                console.log('setInterval addToggles')

            }, getRandomNumber(min, max))

        } else {

        }
    }

    getType() {
        if (this.location.hostname.includes(pageType.lms)) {
            return pageType.lms
        } if (this.location.hostname.includes(pageType.apps)) {
            return pageType.apps;
        } else {
            throw Error('Can not get Type');
        }
    }

    getCourse() {
        if (this.type === pageType.lms) {
            return this.location.pathname.split('/')[3];
        } else {
            throw Error('Can not get Course');
        }
        /*
        https://apps.skillfactory.ru/learning/course/course-v1:Skillfactory+URFUML2023+SEP2023/block-v1:Skillfactory+URFUML2023+SEP2023+type@sequential+block@d84d46b29d204104bd202c16e58511ae/block-v1:Skillfactory+URFUML2023+SEP2023+type@vertical+block@dcde44f54afe4b52914d1864e5d93b24
        https://lms.skillfactory.ru/xblock/block-v1:Skillfactory+URFUML2023+SEP2023+type@vertical+block@dcde44f54afe4b52914d1864e5d93b24?show_title=0&show_bookmark_button=0&recheck_access=1&view=student_view&format=%D0%9C%D0%BE%D0%B4%D1%83%D0%BB%D1%8C
        https://lms.skillfactory.ru/xblock/block-v1:Skillfactory+URFUML2023+SEP2023+type@vertical+block@2027ef13320942568cb8097d6250808b?show_title=0&show_bookmark_button=0&recheck_access=1&view=student_view&format=Модуль
        */
    }

    getCourseName() {
        const course = this.getCourse();
        const [_, courseName] = course.split(':');
        return courseName
    }

    getSequentialBlock() {
        if (this.type === pageType.apps) {
            return this.location.pathname.split('/')[4];
        } else {
            throw new Error('Can not get SequentialBlock');
        }
    }

    getSequentialBlockHash() {
        const sequentialBlock = this.getSequentialBlock();
        const sequentialBlockHash = this.getHashFromBlock(sequentialBlock);
        return sequentialBlockHash;
    }

    getVerticalBlock() {
        if (this.type === pageType.lms) {
            return this.location.pathname.split('/')[2];
        } else if (this.type === pageType.apps) {
            return this.location.pathname.split('/')[5];
        } else {
            throw new Error('Can not get VerticalBlock');
        }
    }

    getVerticalBlockHash() {
        const verticalBlock = this.getVerticalBlock();
        const verticalBlockHash = this.getHashFromBlock(verticalBlock)
        return verticalBlockHash;
    }

    getHashFromBlock(block) {
        const [_1, _2, blockHash] = block.split('@');
        return blockHash;
    }

    getHashFromInputId(inputId) {
        const [_, inputHash] = inputId.split('_');
        return inputHash;
    }

    getProblemBlocks() {
        return [...this.document.querySelectorAll('.vert')].filter(el => el.getAttribute('data-id').includes('problem+block'));
    }

    getProblemBlockByHash(hash) {
        const problemBlocks = this.getProblemBlocks();
        const problemBlock = problemBlocks.find(el => el.getAttribute('data-id').includes(hash))
        return problemBlock;
    }

    getProblemBlockById(problemBlockId) {
        const problemBlocks = this.getProblemBlocks();
        const problemBlock = problemBlocks.find(el => el.getAttribute('data-id') === problemBlockId);
        return problemBlock;
    }

    getProblemBlockId(problemBlock) {
        const problemBlockId = problemBlock.getAttribute('data-id');
        return problemBlockId;
    }

    getProblemBlockIdByHash(hash) {
        const problemBlock = this.getProblemBlockByHash(hash);
        const problemBlockId = this.getProblemBlockId(problemBlock);
        return problemBlockId;
    }

    getBlockProblemIdByProblemBlock(problemBlock) {
        const problemBlockId = this.getProblemBlockId(problemBlock);
        const blockProblemId = problemBlock.querySelector(`[data-problem-id="${problemBlockId}"]`);
        return blockProblemId;
    }

    getInputsByProblemBlock(problemBlock) {
        const inputs = [...problemBlock.getElementsByTagName('input')].filter(el => el.type !== "hidden" && !el.classList.contains('toggle-checkbox'));
        const selects = [...problemBlock.getElementsByTagName('select')];
        const textarea = [...problemBlock.getElementsByTagName('textarea')].filter(el => el.getAttribute('data-mode') === 'python');

        return [...inputs, ...selects, ...textarea];
    }

    getButtonByProblemBlock(problemBlock) {
        const buttons = [...problemBlock.getElementsByTagName('button')].filter(el => el.classList.contains('submit'));
        if (buttons.length !== 1) {
            throw Error('Buttons in problem block is more then one');
        }
        const [button] = buttons;
        return button;
    }

    getHashFromAriaDescribedby(ariaDescribedby) {
        const [_1, _2, hash] = ariaDescribedby.split('_');
        return hash;
    }

    getValuesByBlockHash(hash) {
        const problemBlock = this.getProblemBlockByHash(hash);
        const inputs = this.getInputsByProblemBlock(problemBlock);
        const values = this.getValuesFromInputs(inputs);
        //TODO не грлубокое копирование
        return { ...values };
    }

    getValuesByProblemBlockId(problemBlockId) {
        const hash = this.getHashFromBlock(problemBlockId);
        const values = this.getValuesByBlockHash(hash);
        //TODO не грлубокое копирование
        return { ...values };
    }

    isCorrectRadioOrCheckboxInput(input) {
        //radio label class choicegroup_correct choicegroup_incorrect
        //checkbox label class choicegroup_partially-correct только один правильный нет не правильных
        //хотя бы один не правильный choicegroup_incorrect
        // все правильные choicegroup_correct 
        const classes = {
            correct: 'choicegroup_correct',
            incorrect: 'choicegroup_incorrect',
            partiallyCorrect: 'choicegroup_partially-correct',
        };

        const label = input.parentElement.querySelector(`[for="${input.id}"]`);
        const labelClass = this.isCorrectInput(label, classes);

        return labelClass;
    }

    isCorrectTextInput(input) {
        //text div parent class="incorrect" correct
        const classes = {
            correct: 'correct',
            incorrect: 'incorrect',
        };

        const div = input.parentElement;
        const divClass = this.isCorrectInput(div, classes);

        return divClass;
    }

    isCorrectTextareaInput(input) {
        //textarea span parent class="incorrect" correct
        const classes = {
            correct: 'correct',
            incorrect: 'incorrect',
        };

        const name = input.name;
        const id = name.replace('input', 'status');
        const span = input.parentElement.querySelector(`[id="${id}"]`);;
        const spanClass = this.isCorrectInput(span, classes);

        return spanClass;
    }

    isCorrectInput(elem, classes) {
        for (const clas in classes) {
            if (elem === null) debugger;
            const correctnessClass = elem.classList.contains(classes[clas]);
            /*
            Uncaught (in promise) TypeError: Cannot read properties of null (reading 'classList')
                at Page.isCorrectInput (userscript.html?name=SF-extension.user.js&id=77e765a6-c120-45f1-941a-3b79386c61d1:389:44)
                at Page.isCorrectRadioOrCheckboxInput (userscript.html?name=SF-extension.user.js&id=77e765a6-c120-45f1-941a-3b79386c61d1:370:33)
                at Page.getValuesFromInput (userscript.html?name=SF-extension.user.js&id=77e765a6-c120-45f1-941a-3b79386c61d1:407:30)
                at userscript.html?name=SF-extension.user.js&id=77e765a6-c120-45f1-941a-3b79386c61d1:428:43
                at Array.forEach (<anonymous>)
                at Page.getValuesFromInputs (userscript.html?name=SF-extension.user.js&id=77e765a6-c120-45f1-941a-3b79386c61d1:427:16)
                at Page.getValuesByBlockHash (userscript.html?name=SF-extension.user.js&id=77e765a6-c120-45f1-941a-3b79386c61d1:344:29)
                at MutationObserver.<anonymous> (userscript.html?name=SF-extension.user.js&id=77e765a6-c120-45f1-941a-3b79386c61d1:599:45)
            
            */


            if (correctnessClass) {
                return clas;
            }
        }

        return '';//TODO придумать тип empty?
    }

    isCorrectOneSelect(select) {
        const classes = {
            correct: 'correct',
            incorrect: 'incorrect',
        };

        const selectDescribedby = select.getAttribute('aria-describedby');
        const span = select.parentElement.querySelector(`[id="${selectDescribedby}"]`);
        const spanClass = this.isCorrectInput(span, classes);

        return spanClass;
    }

    getSelectOptions(select) {
        return [...select.querySelectorAll('option')];
    }

    getSelectValue(select) {
        const options = this.getSelectOptions(select);
        const option = options.find(option => option.value === select.value);
        const value = option.value;
        return value;
    }

    getValuesFromInput(input) {
        const id = input.id;
        const type = input.type;
        let value;
        let isCorrect;

        if (['radio', 'checkbox'].includes(type)) {
            value = input.checked;
            isCorrect = this.isCorrectRadioOrCheckboxInput(input);
        }

        if (type === 'text') {
            value = input.value;
            isCorrect = this.isCorrectTextInput(input);
        }

        if (type === 'textarea') {
            value = input.value;
            isCorrect = this.isCorrectTextareaInput(input);
        }

        if (type === 'select-one') {
            value = this.getSelectValue(input);
            isCorrect = this.isCorrectOneSelect(input);
        }

        const hash = this.getHashFromInputId(id);
        const problemBlockId = this.getProblemBlockIdByHash(hash);
        const status = this.getStatusByProblemBlockId(problemBlockId);
        const { graded, hasScore, problemScore, problemTotalPossible, haveSomePoint, haveFullPoint } = status;

        return [id, { type, value, isCorrect, haveSomePoint, haveFullPoint }];
    }

    getValuesFromInputs(inputs) {
        const values = {};

        if (!inputs.length) {
            return values;
            //throw new Error('no fieldsets and inputs');
        }

        inputs.forEach(input => {
            const [inputId, value] = this.getValuesFromInput(input);
            values[inputId] = { ...value };
        });

        return values;
    }

    parsePointString(problemProgress) {
        const problemProgressText = problemProgress.innerText ?? ""; //1/1 point (graded)      1 point possible (graded)
        const possibleOnePoint = problemProgressText.includes('possible');
        const [point, _1, _2] = problemProgressText.split(' ');
        const [currentPoint, allPoint] = possibleOnePoint
            ? [0, 1]
            : point.split('/').map(piont => parseFloat(piont));

        let haveSomePoint = false;
        let haveFullPoint = false;

        if (currentPoint > 0) {
            haveSomePoint = true;
        }

        if (currentPoint === allPoint) {
            haveFullPoint = true;
        }

        return [haveSomePoint, haveFullPoint];
    }

    getStatusByProblemBlockId(problemBlockId) {
        const problemBlock = this.getProblemBlockById(problemBlockId);

        const blockUsageId = problemBlock.querySelector(`[data-usage-id="${problemBlockId}"]`);
        const graded = blockUsageId.getAttribute('data-graded') === 'True';
        const hasScore = blockUsageId.getAttribute('data-has-score') === 'True';
        //TODO при отправле правильного ответа, на странице hasScore не обновляется, такой же как при загрузке страницы

        const blockProblemId = this.getBlockProblemIdByProblemBlock(problemBlock);
        const problemScore = parseFloat(blockProblemId.getAttribute('data-problem-score'));
        //TODO при отправле правильного ответа, на странице data-problem-score не обновляется
        const problemTotalPossible = parseInt(blockProblemId.getAttribute('data-problem-total-possible'));
        const attemptsUsed = parseInt(blockProblemId.getAttribute('data-attempts-used'));

        const problemProgress = problemBlock.querySelector(`[id='${problemBlockId}-problem-progress']`);
        const [haveSomePoint, haveFullPoint] = this.parsePointString(problemProgress);

        const status = { graded, hasScore, problemScore, problemTotalPossible, attemptsUsed, haveSomePoint, haveFullPoint };
        this.status[problemBlockId] = status;

        return status;
    }

    getData() {
        return this.data;
    }

    // isValuesChecked(values) {
    //     const inputsId = Object.keys(values);
    //     if (inputsId.length === 0) {
    //         return false;
    //     }
    //     return inputsId.every(inputId => values[inputId].checked === true);
    // }

    getTypesValues(values) {
        const types = [...new Set(Object.keys(values).map(inputId => values[inputId].type))];
        return types;
    }

    isHaveFullPoint(values) {
        const inputsId = Object.keys(values);
        if (!inputsId.length) return false;

        return inputsId.every(inputId => values[inputId].haveFullPoint === true);
    }

    isHaveSomePoint(values) {
        const inputsId = Object.keys(values);
        if (!inputsId.length) return false;

        return inputsId.every(inputId => values[inputId].haveSomePoint === true);
    }

    isValuesValidFull(values) {
        const inputsId = Object.keys(values);
        if (!inputsId.length) return false;

        return inputsId.every(inputId => values[inputId].isCorrect === this.classes.correct);
    }

    isValuesValidSome(values) {
        const inputsId = Object.keys(values);
        if (!inputsId.length) return false;

        return inputsId.some(inputId => values[inputId].isCorrect === this.classes.correct);
    }

    isValuesValidPartially(values) {
        const inputsId = Object.keys(values);
        if (!inputsId.length) return false;

        return inputsId.some(inputId => values[inputId].isCorrect === this.classes.partiallyCorrect);
    }

    isValuesOnlyCheckbox(values) {
        const inputsId = Object.keys(values);
        if (!inputsId.length) return false;

        const types = this.getTypesValues(values);

        if (types.length > 1) return false;
        if (types[0] !== 'checkbox') return false;

        return true;
    }

    isValuesValidFullNotCheckbox(values) {
        const inputsId = Object.keys(values);
        if (!inputsId.length) return false;

        const types = this.getTypesValues(values);

        if (types.length > 1) return true;
        if (types[0] !== 'checkbox') return true;

        const isValuesValidSome = this.isValuesValidSome(values);
        const isValuesValidPartially = this.isValuesValidPartially(values);

        if (isValuesValidSome && !isValuesValidPartially) {
            return false;
        }
        return true;
    }

    isNeededUpdate(problemBlockId, newValues) {
        //getValidateOptions
        const newOptions = this.getValidateOptions(newValues);
        const values = this.data[problemBlockId] ?? {};
        const options = this.getValidateOptions(values);

        //{ isValuesValidFull, isValuesValidSome, isValuesValidPartially, isValuesValidFullNotCheckbox, isValuesOnlyCheckbox, isHaveFullPoint, isHaveSomePoint }

        // const case1 = Utils.isEmptyObject(values) && (newOptions.isValuesValidFull || newOptions.isValuesValidSome || newOptions.isValuesValidPartially);
        // const case2 = !Utils.isEmptyObject(values) && !options.isValuesValidFull && newOptions.isValuesValidFull && newOptions.isValuesValidFullNotCheckbox;
        // const case99 = !Utils.isEmptyObject(values) && !options.isValuesValidFull && (options.isValuesValidSome || options.isValuesValidPartially)
        //     && newOptions.isValuesValidPartially && newOptions.isValuesValidFullNotCheckbox;

        // const case11 = !Utils.isEmptyObject(values) && (!options.isValuesValidFull && !options.isValuesValidSome && !options.isValuesValidPartially)
        //     && (newOptions.isValuesValidFull || newOptions.isValuesValidSome || newOptions.isValuesValidPartially);

        const case1 = Utils.isEmptyObject(values) && (newOptions.isHaveFullPoint || newOptions.isHaveSomePoint);
        const case2 = !Utils.isEmptyObject(values) && !options.isHaveFullPoint && newOptions.isHaveFullPoint;
        const case3 = !Utils.isEmptyObject(values) && !options.isHaveFullPoint && !newOptions.isHaveFullPoint && options.isHaveSomePoint && newOptions.isHaveSomePoint;
        // const case4 = !Utils.isEmptyObject(values) && !options.isValuesValidFull && newOptions.isValuesValidFull && newOptions.isValuesValidFullNotCheckbox;

        // const case99 = !Utils.isEmptyObject(values) && !options.isValuesValidFull && (options.isValuesValidSome || options.isValuesValidPartially)
        //     && newOptions.isValuesValidPartially && newOptions.isValuesValidFullNotCheckbox;

        // const case11 = !Utils.isEmptyObject(values) && (!options.isValuesValidFull && !options.isValuesValidSome && !options.isValuesValidPartially)
        //     && (newOptions.isValuesValidFull || newOptions.isValuesValidSome || newOptions.isValuesValidPartially);





        const cases = { case1, case2, case3 };
        const isNeededUpdate = case1 || case2 || case3;
        //TODO добавить сценарий когда есть частино коректные или не корректные и их надо обновить

        console.log('isNeededUpdate', isNeededUpdate, problemBlockId, cases, values, newValues);
        console.log('options', options);
        console.log('newOptions', newOptions);
        return { isNeededUpdate, cases };
    }


    isNeededUpdateOld(problemBlockId, validates) {
        const { newValues, wasValidetedFull, wasValidetedPartially } = validates;
        const values = this.data[problemBlockId] ?? {};

        //TODO если стоит не правильный ответ, по после выбора правильного и нажатия на кнопку values = undefined
        const isValuesValidFull = this.isValuesValidFull(values);
        const isValuesValidSome = this.isValuesValidSome(values);
        const isValuesValidPartially = this.isValuesValidPartially(values);

        // const newIsValuesValidFull = this.isValuesValidFull(newValues);
        // const newIsValuesValidSome = this.isValuesValidSome(newValues);
        // const newIsValuesValidPartially = this.isValuesValidPartially(newValues);

        const isValuesValidFullNotCheckbox = this.isValuesValidFullNotCheckbox(values);

        const case1 = Utils.isEmptyObject(values) && (wasValidetedFull || wasValidetedPartially);
        const case2 = !Utils.isEmptyObject(values) && (!isValuesValidFull && !isValuesValidSome && !isValuesValidPartially) && (wasValidetedFull || wasValidetedPartially);
        const case3 = !Utils.isEmptyObject(values) && !isValuesValidFull && (isValuesValidSome || isValuesValidPartially) && wasValidetedPartially && isValuesValidFullNotCheckbox;
        const case4 = !Utils.isEmptyObject(values) && !isValuesValidFull && wasValidetedFull && isValuesValidFullNotCheckbox;

        const cases = { case1, case2, case3, case4 };
        const isNeededUpdate = case1 || case2 || case3 || case4;
        //TODO добавить сценарий когда есть частино коректные или не корректные и их надо обновить

        console.log('isNeededUpdate', isNeededUpdate, problemBlockId, cases, values, newValues);
        console.log('wasValidetedFull', wasValidetedFull, 'wasValidetedPartially', wasValidetedPartially,
            'isValuesValidFull', isValuesValidFull, 'isValuesValidSome', isValuesValidSome, 'isValuesValidPartially', isValuesValidPartially);
        return { isNeededUpdate, cases };
    }

    mergeValues(problemBlockId, values, cases) {
        //TODO добавить обрабокту значний, чтобы если есть инкорект или частично корект заменялись коректом, если уже корект - ни на что не менять
        const { case3 } = cases;
        const oldValues = this.data[problemBlockId] ?? {};
        const newValues = {};
        let newValuesWasAdded = false;
        let oldValuesWasAdded = false;
        console.log('mergeValues problemBlockId', problemBlockId);

        const allValues = Object.keys({ ...oldValues, ...values });

        if (case3) {
            allValues.forEach(inputId => {
                const oldValue = oldValues[inputId] ?? {};
                const value = values[inputId] ?? {};

                if (!oldValue?.isCorrect && value?.isCorrect && (value.isCorrect !== this.classes.incorrect)) {
                    newValues[inputId] = value;
                    console.log('1 newValues[inputId] = value');
                    console.log(inputId, oldValue, value);
                    newValuesWasAdded ||= true;
                }
                if (oldValue?.isCorrect && (oldValue.isCorrect === this.classes.correct)) {
                    newValues[inputId] = oldValue;
                    console.log('2 newValues[inputId] = oldValue');
                    console.log(inputId, oldValue, value);
                    oldValuesWasAdded ||= true;
                }
                if (oldValue?.isCorrect && (oldValue.isCorrect !== this.classes.correct) && value?.isCorrect && (value.isCorrect !== this.classes.incorrect)) {
                    newValues[inputId] = value;
                    console.log('3 newValues[inputId] = value');
                    console.log(inputId, oldValue, value);
                    newValuesWasAdded ||= true;
                }
            });
        }

        const mergedValues = { ...values, ...newValues };

        return { mergedValues, newValuesWasAdded, oldValuesWasAdded };
    }

    async updateValues(problemBlockId, values, cases) {
        const { mergedValues, newValuesWasAdded, oldValuesWasAdded } = this.mergeValues(problemBlockId, values, cases);
        this.data[problemBlockId] = mergedValues;
        console.log('updateValues', newValuesWasAdded, oldValuesWasAdded, mergedValues);
        // if (newValuesWasAdded || oldValuesWasAdded) {
        await this.updateData();
        // }
    }

    async updateData() {
        const block = this.getVerticalBlock();
        const directory = directoryType.verticalBlocks;
        await this.store.savePage(this.data, directory, block);
    }

    checkValidatedType(values, validatedType) {
        const inputsId = Object.keys(values);
        if (!inputsId.length) return false;
        //не правильно для типов кроме фул корект
        const checkValidatedType = inputsId.every(inputId => values[inputId].validated === validatedType);
        return checkValidatedType;
    }

    setValidateType(values, validatedType) {
        const newValues = {};
        Object.keys(values).forEach(inputId => newValues[inputId] = { ...values[inputId], validated: validatedType });
        return newValues;
    }

    getValidateOptions(values) {
        const isValuesValidFull = this.isValuesValidFull(values);
        const isValuesValidSome = this.isValuesValidSome(values);
        const isValuesValidPartially = this.isValuesValidPartially(values);
        const isValuesValidFullNotCheckbox = this.isValuesValidFullNotCheckbox(values);
        const isValuesOnlyCheckbox = this.isValuesOnlyCheckbox(values);
        const isHaveFullPoint = this.isHaveFullPoint(values);
        const isHaveSomePoint = this.isHaveSomePoint(values);


        return { isValuesValidFull, isValuesValidSome, isValuesValidPartially, isValuesValidFullNotCheckbox, isValuesOnlyCheckbox, isHaveFullPoint, isHaveSomePoint };
    }

    validateFetchedValues(values) {//TODO поменять имя, валидируются данные со страницы
        const wasValidetedFull = this.checkValidatedType(values, validatedType.wasValidetedFull);
        const wasValidetedPartially = this.checkValidatedType(values, validatedType.wasValidetedPartially);

        const validatedValues = (wasValidetedFull || wasValidetedPartially)
            ? { ...values }
            : {};

        console.log('validateFetchedValues', validatedValues, wasValidetedFull, wasValidetedPartially);
        console.log(JSON.stringify(values));
        return { validatedValues, wasValidetedFull, wasValidetedPartially };
    }

    validateValues(values, problemBlockId) {
        const status = this.getStatusByProblemBlockId(problemBlockId);
        const { graded, hasScore, problemScore, problemTotalPossible, haveSomePoint, haveFullPoint } = status;
        console.log('status', status);

        const wasValidetedFull = haveFullPoint; // (graded && hasScore && problemScore === problemTotalPossible) || haveFullPoint;
        const wasValidetedPartially = haveSomePoint; // (graded && hasScore && problemScore !== problemTotalPossible && problemScore > 0) || haveSomePoint;

        const validatedValues = wasValidetedFull
            ? this.setValidateType(values, validatedType.wasValidetedFull)
            : wasValidetedPartially
                ? this.setValidateType(values, validatedType.wasValidetedPartially)
                : {};

        console.log('validateValues', validatedValues, wasValidetedFull, wasValidetedPartially);
        console.log(JSON.stringify(values));
        return { validatedValues, wasValidetedFull, wasValidetedPartially };
    }

    insertToggleCSS() {
        const css = `        
            .toggle {
                cursor: pointer;
                display: inline-block;
                vertical-align: top;
            }
            
            .toggle-switch {
                margin-left: 30px;
                display: inline-block;
                background: #ccc;
                border-radius: 16px;
                width: 50px;
                height: 24px;
                position: relative;
                vertical-align: middle;
                transition: background 0.25s;
            }
            .toggle-switch:before, .toggle-switch:after {
                content: "";
            }
            .toggle-switch:before {
                display: block;
                background: linear-gradient(to bottom, #fff 0%, #eee 100%);
                border-radius: 50%;
                box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.25);
                width: 16px;
                height: 16px;
                position: absolute;
                top: 4px;
                left: 4px;
                transition: left 0.25s;
            }
            .toggle:hover .toggle-switch:before {
                background: linear-gradient(to bottom, #fff 0%, #fff 100%);
                box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.5);
            }
            .toggle-checkbox:checked + .toggle-switch {
                background: #56c080;
            }
            .toggle-checkbox:checked + .toggle-switch:before {
                left: 30px;
            }
            
            .toggle-checkbox {
                position: absolute;
                visibility: hidden;
            }
            
            .toggle-label {
                margin-left: 5px;
                position: relative;
                top: 2px;
            }
            `;

        const head = document.head || document.getElementsByTagName('head')[0];
        const style = document.createElement('style');

        head.appendChild(style);
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
    }

    createToggle(toggleHandler) {
        const toggle = this.createElement('label', 'toggle');
        const input = this.createElement('input', 'toggle-checkbox', false, 'checkbox');
        const div = this.createElement('div', 'toggle-switch');
        const span = this.createElement('span', 'toggle-label', 'Hint');

        toggle.insertAdjacentElement('beforeend', input);
        toggle.insertAdjacentElement('beforeend', div);
        toggle.insertAdjacentElement('beforeend', span);

        input.addEventListener('change', toggleHandler);
        this.insertToggleCSS();

        return toggle;
    }

    createElement(tag, clas, text, type) {
        const elem = document.createElement(tag);

        clas && elem.classList.add(clas);
        text && (elem.innerText = text);
        type && (elem.type = type);

        return elem;
    }

    addToggles() {
        const problemBlocks = this.getProblemBlocks();


        problemBlocks.forEach(problemBlock => {
            this.addToggle(problemBlock);
        })
    }

    addToggle(problemBlock) {
        const $toggle = problemBlock.querySelector('label.toggle')
        if ($toggle) return;

        const problemBlockId = this.getProblemBlockId(problemBlock);


        // console.log('addToggle', problemBlockId, problemBlock)
        const values = this.data[problemBlockId] ?? {};

        if (Utils.isEmptyObject(values)) return; //toggle.disabled  = true;

        const h3 = problemBlock.querySelector('h3');
        h3.style = 'display: inline-block';

        const toggle = this.createToggle(this.toggleHandler);
        h3.insertAdjacentElement('afterend', toggle);

        const br = this.createElement('br');
        toggle.insertAdjacentElement('afterend', br);
    }

    toggleHandler = (e) => {
        const toggle = e.target;
        const problemBlock = toggle.parentElement.parentElement.parentElement.parentElement;
        const problemBlockId = this.getProblemBlockId(problemBlock);
        const inputs = this.getInputsByProblemBlock(problemBlock);

        if (toggle.checked) {
            this.showHint(problemBlockId, inputs);
        } else {
            this.hideHint(problemBlockId, inputs);
        }
    }

    getColorHint(value, show) {
        let color = 'black';

        if (!show) return color;
        if (!value.isCorrect) return color;

        if (value.isCorrect === this.classes.correct) color = 'green';
        if (value.isCorrect === this.classes.incorrect) color = 'red';
        if (value.isCorrect === this.classes.partiallyCorrect) color = 'orange';

        return color;
    }

    setColorOptionBySelect(select, value, color) {
        const options = this.getSelectOptions(select);
        const option = options.find(option => option.value === value);
        option.style.color = color;
    }

    setDivTitleByTextarea(textarea, value, show) {
        const div = textarea.parentElement.querySelector(`.CodeMirror-wrap`);
        div.title = show ? value : '';
    }

    changeHint(problemBlockId, inputs, show = false) {
        const values = this.data[problemBlockId];
        if (Object.keys(values).length !== inputs.length) {
            //console.error('Object.keys(storeValues).length !== inputs.length')
            //if type radio
        }

        inputs.forEach(input => {
            const id = input.id;
            const type = input.type;
            const storeValue = values[id] ?? {};
            const color = this.getColorHint(storeValue, show);

            if (Boolean(storeValue.isCorrect)) {
                if (['radio', 'checkbox'].includes(type)) {
                    const label = input.parentElement.querySelector(`[for="${id}"]`);
                    label.style.color = color;
                    const img = label.querySelector(`img`);
                    if (img) {
                        img.style.border = show ? `solid 1px ${color}` : 'none';
                    }
                }

                if (type === 'text') {
                    input.placeholder = show
                        ? (color !== 'red' ? storeValue.value : '')
                        : '';
                    //TODO поправить чтобы если не всех значений стоит коррект класс, то обновить облако и подумать что делать для остальных типов инпута
                }

                if (type === 'textarea') {
                    this.setDivTitleByTextarea(input, storeValue.value, show);
                }

                if (type === 'select-one') {
                    this.setColorOptionBySelect(input, storeValue.value, color);
                }
            }
        });
    }

    showHint(problemBlockId, inputs) {
        this.changeHint(problemBlockId, inputs, true);
    }

    hideHint(problemBlockId, inputs) {
        this.changeHint(problemBlockId, inputs, false);
    }

    addObserverToProblemBlock(problemBlock, problemBlockId, blockProblemId) {
        let observer = new MutationObserver(async mutationRecords => {
            for (const item of mutationRecords) {
                if (blockProblemId === item.target && item.addedNodes.length !== 0 && item.addedNodes.length !== 1) {
                    // // console.log('observer', item.addedNodes.length, item);
                    const values = this.getValuesByProblemBlockId(problemBlockId);
                    // const validates = this.validateValues(values, problemBlockId);

                    const { isNeededUpdate, cases } = this.isNeededUpdate(problemBlockId, values);
                    // const { isNeededUpdate, cases } = this.isNeededUpdate(problemBlockId, validates);
                    // const { validatedValues } = validates;

                    if (isNeededUpdate) {
                        await this.updateValues(problemBlockId, values, cases);
                    }

                    const problemBlock = this.getProblemBlockById(problemBlockId);
                    this.addToggle(problemBlock);
                }
            }
        });

        observer.observe(problemBlock, {
            childList: true,
            subtree: true,
        });
    }

    initPage() {
        const problemBlocks = this.getProblemBlocks();
        const data = {};

        problemBlocks.forEach(problemBlock => {
            const problemBlockId = this.getProblemBlockId(problemBlock);
            const values = this.getValuesByProblemBlockId(problemBlockId);
            data[problemBlockId] = values;

            //const { validatedValues } = this.validateValues(values, problemBlockId);
            // data[problemBlockId] = validatedValues;

            const blockProblemId = this.getBlockProblemIdByProblemBlock(problemBlock);
            this.addObserverToProblemBlock(problemBlock, problemBlockId, blockProblemId)
        });

        return data;
    }

    loadDataFromStore(directory) {
        const store = this.store.get();
        const data = store.data[directory];
        return data;
    }

    //TODO выставляется ли isCorrect" при правильном ответе и при скане страницы если уже отвечено

    async compareData(data) {
        console.log('compareData', JSON.stringify(data));
        console.log(JSON.stringify(this.data));
        let isNeededUpdateData = false;
        let newValuesWasAddedToData = false;
        let oldValuesWasAddedToData = false;
        const problemBlocksId = Object.keys({ ...this.data, ...data });

        problemBlocksId.forEach(problemBlockId => {
            const values = data[problemBlockId] ?? {};
            //const validates = this.validateFetchedValues(values);

            console.log('problemBlocksId.forEach', problemBlockId);

            const { isNeededUpdate, cases } = this.isNeededUpdate(problemBlockId, values);
            //TODO если данные на сервере устарели, надо обновить
            // сначала получать данные с стора и сервера, потом сверять со страницей
            // const { validatedValues } = validates;

            isNeededUpdateData ||= isNeededUpdate;



            if (isNeededUpdate) {
                const { mergedValues, newValuesWasAdded, oldValuesWasAdded } = this.mergeValues(problemBlockId, values, cases);
                console.log('problemBlocksId.forEach isNeededUpdate true', newValuesWasAdded, oldValuesWasAdded, mergedValues);

                this.data[problemBlockId] = mergedValues;
                newValuesWasAddedToData ||= newValuesWasAdded;
                oldValuesWasAddedToData ||= oldValuesWasAdded;
            }
        });

        this.addToggles();

        console.log('isNeededUpdateData', isNeededUpdateData, newValuesWasAddedToData, oldValuesWasAddedToData);
        //if (isNeededUpdateData && (newValuesWasAddedToData || oldValuesWasAddedToData)) {
        if (isNeededUpdateData) {
            await this.updateData();
        }

        // if (isNeededUpdate) {
        //     await this.updateValues(problemBlockId, validatedValues, cases);
        // }


        // async updateValues(problemBlockId, values, cases) {
        //     const { mergedValues, newValuesWasAdded, oldValuesWasAdded } = this.mergeValues(problemBlockId, values, cases);
        //     this.data[problemBlockId] = mergedValues;
        //     console.log('updateValues', newValuesWasAdded);
        //     if (newValuesWasAdded || oldValuesWasAdded) {
        //         await this.updateData();
        //     }
        // }



        /*
                // const validates = this.validateValues(values, problemBlockId);
                // const { isNeededUpdate, cases } = this.isNeededUpdate(problemBlockId, validates);
                // const { validatedValues }= validates;
        
                // if (isNeededUpdate) {
                // this.data[problemBlockId] = this.mergeValues(problemBlockId, values, cases);
                // await this.updateData();
                //     await this.updateValues(problemBlockId, validatedValues, cases);
                // }
        
                // let isNeededUpdate = false;
                // let isNeededRescan = false;
        
                // Object.keys(this.data).forEach(blockId => {
                //     const values = data[blockId] ?? {};
                //     const oldValues = this.data[blockId] ?? {};
        
                //     if (
                //         (Utils.isEmptyObject(values) && this.isValuesChecked(oldValues))
                //         || (!Utils.isEmptyObject(values) && !this.isValuesChecked(values) && this.isValuesChecked(oldValues))
                //     ) {
                //         //data[blockId] = this.data[blockId];
                //         isNeededUpdate = true;
                //     }
        
                //     if (
                //         (Utils.isEmptyObject(oldValues) && this.isValuesChecked(values))
                //         || (!Utils.isEmptyObject(oldValues) && !this.isValuesChecked(oldValues) && this.isValuesChecked(values))
                //     ) {
                //         this.data[blockId] = values;
                //         isNeededRescan = true;
                //     }
                // });
        
                // this.addToggles();
        
                // // console.log('isNeededUpdate', isNeededUpdate, isNeededRescan)
                // if (isNeededUpdate) {
                //     //this.data = data;
                //     await this.updateData();
                // }
        
                // if (isNeededRescan) {
                //     //this.updateData();
                // }
                */
    }
}

class Store {
    store
    url
    auth
    page

    constructor(url, auth, page) {
        this.url = url;
        this.auth = auth;
        this.page = page;
        // this.store = this.getStoreFromLocalStorage();
        this.store = initStore;
        console.log('Store', this)
    }

    async init() {
        const expireTime = Date.now() / 1000 - 1000; //1800

        if (this.store.time < expireTime) {
            await this.fetchToken();
        } else {
            this.auth.setIdToken(this.store.idToken);
        }

        const directory = directoryType.verticalBlocks;
        const block = this.page.getVerticalBlock();
        await this.fetchStore(directory, block);
        // this.addStoreToLocalStorage();
    }

    async fetchToken() {
        await this.auth.withEmailAndPassword();
        this.store.idToken = this.auth.getIdToken();
    }

    async fetchStore(directory, block) {
        const data = await this.fetch(directory, block);
        this.store.time = Date.now() / 1000;
        if (!Utils.isEmptyObject(data)) this.store.data[directory] = data;
    }

    get() {
        return this.store
    }

    async savePage(data, directory, block) {
        // this.addStoreToLocalStorage();
        const res = await this.put(data, directory, block);
    }

    addStoreToLocalStorage() {
        localStorage.setItem('store', JSON.stringify(this.store));
    }

    getStoreFromLocalStorage() {
        return JSON.parse(localStorage.getItem('store') || JSON.stringify(initStore))
    }

    escapingString(string, back = false) {
        return back
            ? string.replace(/&2E;/g, '.')
            : string.replace(/\./g, '&2E;');
    }

    escapingKeysOfObject(obj, back = false) {
        const newObj = {};

        for (const key in obj) {
            const value = obj[key];
            const newKey = back
                ? key.replace(/&2E;/g, '.')
                : key.replace(/\./g, '&2E;');
            newObj[newKey] = value;
        }

        return newObj;
    }

    async put(body, directory, block) {
        console.log('put', JSON.stringify(body));
        const escapingBlock = this.escapingString(block);
        const escapingBody = this.escapingKeysOfObject(body);
        const path = { directory, block: escapingBlock };
        const options = {
            method: 'PUT',
            body: JSON.stringify(escapingBody),
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const data = await this.makeRequestWithErrorHandlers(path, options);
        const escapingData = this.escapingKeysOfObject(data, true);
        return escapingData;
    }

    async post(courses) {
        const response = await fetch(`${this.url}/courses.json`, {
            method: 'POST',
            body: JSON.stringify(courses),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json();
        return data;
        //courses.id = data.name
        //return courses

        //.then(addToLocalStorage)
        //.then(Question.renderList)
    }

    async makeRequest(path, options = {}) {
        console.log('path', path);
        const url = this.getUrl(path);
        const response = await fetch(url, options);
        const data = await response.json() ?? {};
        return data;
    }

    async makeRequestWithErrorHandlers(path, options) {
        let data = await this.makeRequest(path, options);

        if (data?.error) {
            if (data.error === 'Permission denied') {
                await this.fetchToken();
                // this.addStoreToLocalStorage();
                data = await this.makeRequest(path, options);
            } else {
                throw new Error(data.error);
            }
            //{error: 'Permission denied'}
            //{error: 'Invalid path: Invalid token in path'}
            //{error: "Invalid data; couldn't parse key beginning at 1:2. Key value can't be empty or contain $ # [ ] / or ."}
        }

        return data;
    }

    getUrl(path) {
        const url = `${this.url}/${path.directory}/${path.block}.json?auth=${this.auth.idToken}`;
        return url;
    }

    async fetch(directory, block) {
        console.log('fetch');
        const escapingBlock = this.escapingString(block);
        const path = { directory, block: escapingBlock };
        const data = await this.makeRequestWithErrorHandlers(path);
        const escapingData = this.escapingKeysOfObject(data, true);

        return escapingData;
    }
}

class Auth {
    apiKey
    email
    password
    idToken

    constructor(apiKey, email = 'you@sf.ru', password = 'asshole') {
        this.apiKey = apiKey;
        this.email = email;
        this.password = password;
        console.log('Auth', this);
    }

    async withEmailAndPassword(email = this.email, password = this.password) {
        const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`, {
            method: 'POST',
            body: JSON.stringify({
                email, password,
                returnSecureToken: true
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        const idToken = await data.idToken;
        this.setIdToken(idToken);
    }

    getIdToken() {
        return this.idToken
    }

    setIdToken(idToken) {
        this.idToken = idToken;
    }
}

const initStore = {
    idToken: '',
    time: 1610105083,
    data: {},
}

const url = 'https://sf-extension-default-rtdb.europe-west1.firebasedatabase.app';
const apiKey = 'AIzaSyDxbgMiXCv2jolu6HI3WKO5gRTay0G6W0A';

async function handlerSequentialBlockPage() {

}

async function handlerVerticalBlockPage() {
    /*
    загружаю стор
    проверяю устарели ли данные, если да - прохожу аунтефикацию и обновляю стор
    сканирую страничку
    есть есть блоки с вопросами, прохожусь по ним, после отправляю на сервер если есть правильные ответы
    если в блоке вопрос отвечен правильно, записываю что точно правильные ответы
    если вопрос не отвечен, выдаю подсказки
    навешиваю обработчик на сабмит, при срабатывании проверяю есть ли правильные ответы, сохраняю с локальный стор, отправляю на сервер
    //TODO при открытии новой страницы если тайминг не вышел, нужно токен передавать в класс чтобы заново аунтефикацию не проходить  
    */

    const page = new Page(document);
    const auth = new Auth(apiKey);
    const store = new Store(url, auth, page);
    await store.init();
    await page.init(store);

}


(async function (window, undefind) {
    'use strict';
    const w = window;

    console.log(w.location.pathname)
    console.log(w.self)
    console.log(w.top)

    if (w.self !== w.top) {
        if (w.self.location.hostname.includes(pageType.lms)) {
            await router.route([
                {
                    host: hostname.lms,
                    path: pathname.verticalBlock,
                    handler: handlerVerticalBlockPage
                }
            ]);
        } else {
            return;
        }
    } else {
        await router.route([
            {
                host: hostname.apps,
                path: pathname.home,
                handler: handlerHomePage,
            },
            // {
            //     host: hostname.apps,
            //     path: pathname.progress,
            //     handler: handlerProgressPage,
            // },
            {
                host: hostname.apps,
                path: pathname.sequentialBlock,
                handler: handlerSequentialBlockPage
            },
            {
                host: hostname.lms,
                path: pathname.verticalBlock,
                handler: handlerVerticalBlockPage
            }
        ]);
    }
})(window);


