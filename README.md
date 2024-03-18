# sf_extension
Приложение представляющее собой расширение для LMS SF в виде userscript для Tampermonkey

## Функционал
1. Меняет дизайн списка предметов слева на главной странице
2. Показывает подсказки в тестах

## Описание функционала
### Меняет дизайн списка предметов слева на главной странице
При открытии страницы курса левая панель меняется в дизайне

https://apps.skillfactory.ru/learning/course/course-v1:Skillfactory+URFUML2023+SEP2023/home

Предметы разбиры на блоки, можно скрыть, можно раскрыть. Немного уменьшена высота кнопок и увеличина ширина чтобы на странице больше умещалось.

![Screenshot 0](https://github.com/srtxtex/sf_extension/blob/main/images/0.png)

### Показывает подсказки в тестах
В блоках где есть задания, справа от номера задания появляется переключатель показывающий подсказки. 
Если переключателя нет - подсказок в базе нет.

Так выглядит перелючталь когда подсказки есть, но не показываются (состояние по умолчанию если подсказки есть в базе):

![Screenshot 10](https://github.com/srtxtex/sf_extension/blob/dev/images/10.png)

Так выглядит когда вы включили отображение подсказок:

![Screenshot 11](https://github.com/srtxtex/sf_extension/blob/dev/images/11.png)

Подсказки заносятся в базу при открытии страницы с пройденым заданием или в процессе его прохождения при правильном ответе.
Если в эти моменты расширение работало (было установлено и включено), ответы отправятся в базу и будут доступны всем пользователям приложения.
Если кнопки подсказки нет или она пропала после отправки ответа, перезагрузите страницу. Если это не помогло, можете написать мне с примером - скорее всего подсказки для данного типа ввода не разработаны или подсказки еще нет в базе.

Как выглядят подсказки:

- для checkbox и radio элементов правильный ответ будет зеленым цветом если это текст и обведен зеленой рамкой если это картинка. Если тип checkbox и правильных ответов несколько, но в базе только часть правильных ответов (еще не все), они буду выделены оранжевым.

![Screenshot 12](https://github.com/srtxtex/sf_extension/blob/dev/images/12.png)

- для select элменетов нужный option будет зеленого цвета.

![Screenshot 13](https://github.com/srtxtex/sf_extension/blob/dev/images/13.png)

- для text элементов правильный ответ будет показан в его placeholder.

![Screenshot 14](https://github.com/srtxtex/sf_extension/blob/dev/images/14.png)

- для textarea элементов при наведелнии на него будет показан title (tooltip) с правильным ответом.

![Screenshot 15](https://github.com/srtxtex/sf_extension/blob/dev/images/15.png)

## Установка
### Установить Tampermonkey
Зайти в интернет-магазин для своего браузера и установить бесплатное расширение Tampermonkey

Здесь все инструкции и ссылки для всех браузеров
https://www.tampermonkey.net/

Ниже добавил прямые для топ 3

Chrome
https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=ru

Firefox
https://addons.mozilla.org/ru/firefox/addon/tampermonkey/

Opera
https://addons.opera.com/ru/extensions/details/tampermonkey-beta/

Видео инструкция
https://www.youtube.com/watch?v=8tyjJD65zws

### Добавить userscript
Скопировать код ниже для main версии 

```
// ==UserScript==
// @name         SF extension
// @version      0.1
// @author       VirtusTex
// @updateURL https://raw.githubusercontent.com/srtxtex/sf_extension/main/userscript.js
// ==/UserScript==
```
или следующий код для dev версии

```
// ==UserScript==
// @name         SF extension
// @version      0.1
// @author       VirtusTex
// @updateURL https://raw.githubusercontent.com/srtxtex/sf_extension/dev/userscript.js
// ==/UserScript==
```

и добавить его в Tampermonkey в качестве нового юзрскрипта

Нажать на иконку в трее браузера, выбрать "Панель управления"

![Screenshot 1](https://github.com/srtxtex/sf_extension/blob/dev/images/1.png)

Нажать на таб где плюс, выглядит как открыть новую вкладку

![Screenshot 2](https://github.com/srtxtex/sf_extension/blob/dev/images/2.png)

Выделить все что внутри и удалить

![Screenshot 3](https://github.com/srtxtex/sf_extension/blob/dev/images/3.png)

Вставить код из userscript.js и сохранить (Ctrl+S или Файл->Сохранить)

![Screenshot 4](https://github.com/srtxtex/sf_extension/blob/dev/images/4.png)

![Screenshot 5](https://github.com/srtxtex/sf_extension/blob/dev/images/5.png)

Перейти во вкладу "Установленные скрипты" и нажать на строку со временем в строке установленного скрипта в колонке "Обновлен"

![Screenshot 6](https://github.com/srtxtex/sf_extension/blob/dev/images/6.png)

Появится окно обновления, нажать кнопку "Обновить". Далее обновления будут скачиваться сами при появлении новой версии, иногда при автообновлении будет появзяться такое же окно.

![Screenshot 7](https://github.com/srtxtex/sf_extension/blob/dev/images/7.png)

Скрипт работает если включен данный переключатель

![Screenshot 8](https://github.com/srtxtex/sf_extension/blob/dev/images/8.png)

Весь Tampermonkey со всеми его включенными скриптами работает если сам Tampermonkey включен как показанно здесь

![Screenshot 9](https://github.com/srtxtex/sf_extension/blob/dev/images/9.png)

## Планы
1. Поработать с прогресс баром
2. Добавить подсказки на основе обученных моделей

## Обратная связь
Создавайте issues или пишите мне

Telegram @VirtusTex

Email srtxtex@gmail.com