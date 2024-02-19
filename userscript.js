// ==UserScript==
// @name         SF extension
// @version      0.2
// @description  SF extension
// @author       VirtusTex
// @license      GPL-3.0 license
// @grant        GM_xmlhttpRequest
// @include https://apps.skillfactory.ru/*
// @downloadURL https://raw.githubusercontent.com/srtxtex/sf_extension/main/userscript.js
// @updateURL https://raw.githubusercontent.com/srtxtex/sf_extension/main/userscript.js
// ==/UserScript==

const delay = 700;

(function (window, undefind) {
    'use strict';
    const w = window;
    function start() {
        const data = {
            '1': ['I. Операционная система Linux', 'I. Программирование на Python', 'I. Business English. Начинающие', 'I. Business English. Продолжающие', 'I. Программная инженерия. Часть I', 'I. Математические основы анализа данных. Часть I', 'I. Математические основы машинного обучения. Часть I', 'I. Цифровые компетенции в научной деятельности', 'I. Проектный практикум'],
            '2': ['II. Основы SQL', 'II. Научный английский', 'II. Углубленное программирование на Python', 'II. Автоматизация администрирования MLOps', 'II. Программная инженерия. Часть II', 'II. Математические основы машинного обучения. Часть II', 'II. Математические основы анализа данных. Часть II', 'II. Глубокие нейронные сети на Python', 'II. Проектный практикум 2'],
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

        if (w.location.pathname === Pathname.Home) {
            setTimeout(remakeNav, 1000);
        }
    }
    if (w.self !== w.top) {
        return;
    } else {
        const timerId = setInterval(() => {
            const nav = document.getElementsByClassName('sf-course-menu sf-outline-page__course-menu');
            if (Boolean(nav.length)) {
                clearInterval(timerId);
                start();
            }
        }, 100);
    }
})(window);