// ==UserScript==
// @name         SF
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  SF extends
// @author       VirtusTex
// @match        https://under-prog.ru/
// @icon         https://www.google.com/s2/favicons?domain=under-prog.ru
// @grant        GM_xmlhttpRequest
// @connect https://apps.skillfactory.ru/
// @include https://apps.skillfactory.ru/*
// @downloadURL https://ya.ru
// @updateURL https://ya.ru
// ==/UserScript==

const delay = 700;
console.log(1);
//https://apps.skillfactory.ru/learning/course/course-v1:Skillfactory+URFUML2023+SEP2023/

(function(window, undefind) {
    'use strict';
    const w = window;
    function start(){
        const data = {
            '1': ['Адаптационный блок', 'Записи встреч (организационные, внеучебные)'],
            '2': ['Выравнивающий курс по математике'],
        }
        const [nav] = document.getElementsByClassName('sf-course-menu sf-outline-page__course-menu');
        const ul = nav.firstChild;
        const buttonsLinks = {};
        for (let li of ul.children){
            const name = li.innerText;
            buttonsLinks[name] = li;
        }
        let buttonList = [];
        Object.keys(data).forEach(semesterNumber => {
            const disciplines = data[semesterNumber];
            const cloneUl = ul.cloneNode(true);
            const bullet = document.createElement('div');
            bullet.style.padding = '20px';
            bullet.style.cursor = 'pointer';
            bullet.innerHTML = `&#8227; ${semesterNumber} Семестр`;
            nav.insertAdjacentElement('afterbegin', cloneUl);
            nav.insertAdjacentElement('afterbegin', bullet);
            const list = bullet.nextElementSibling.childNodes;
            list.forEach(item => {
                const discipline = item.innerText;
                if (!disciplines.includes(discipline)){
                    item.style.display = 'none';
                    //item.remove();
                }
            });
            bullet.onclick = function(){
                const ul = this.nextElementSibling;
                const display = ul.style.display;
                ul.style.display = Boolean(display) ? '' : 'none';
            }
            buttonList = [...buttonList, ...cloneUl.children];            
        });

        for (let li of buttonList){
            li.onclick = function(){
                for (let el of buttonList){
                    el.classList.remove('sf-course-menu__item--selected');                      
                }
                this.classList.add('sf-course-menu__item--selected');
                const name = this.innerText;
                buttonsLinks[name].click();
            }                
        }
        ul.style.display = 'none';
    }
    if (w.self !== w.top){
        return;
    } else {
        const timerId = setInterval(() => {            
            const nav = document.getElementsByClassName('sf-course-menu sf-outline-page__course-menu');
            if (Boolean(nav.length)){
                clearInterval(timerId);
                start();
            }
        }, 100);
    }
})(window);