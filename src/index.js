import './style.css';
import { fromEvent, of, Observable, from } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { catchError, map, switchMap } from 'rxjs/operators';

const userName = document.getElementById('user');
const btn = document.getElementById('btn');
const p = document.querySelector('.output');
const form = document.querySelector('form');
const info = document.querySelector('.info');
const spinner = document.querySelector('.myspinner');
const footer = document.querySelector('footer');

const url = 'https://api.github.com/users/';

const search$ = fromEvent(btn, 'click');

search$
    .pipe(
        map(ev => {
            loading();
            ev.preventDefault();
            return userName.value;
        })
    )
    .subscribe(value => {
        getUser(value);
    })

const getUser = (value) => {
    setTimeout(() => {
        fromFetch(`https://api.github.com/users/${value}`)
        .pipe(
            switchMap(response => {
                if (response.ok) {
                    return response.json()
                };
            })
        )
        .subscribe({
            next: value => {
                info.innerHTML = "";
                spinner.style.display = 'none';
                p.style.color = 'green';
                p.innerHTML = 'Пользователь найден';
                userInfo(value);
                footer.classList.add('footer');
                footer.innerHTML = '<div class="col copy">@Created by Alexandr Malyshev</div>';
            },
            error: err => {
                spinner.style.display = 'none';
                p.style.color = 'red';
                p.innerHTML = 'Пользователь не найден. ' + err.message;
                info.innerHTML = "";
                footer.innerHTML = "";
                footer.classList.remove('footer');
            }
        })
    }, 1000)
}

const userInfo = (value) => {
    const article = document.createElement('article');
    const html = `
        <div class="img">
            <img src=${value.avatar_url} alt=${value.login}>
        </div>
        <div class="user_info">
            <h3>${value.name}</h3>
            <p class='login'>${value.login}</p>
            <ul>
                <li class="location">
                    <svg class="octicon octicon-location" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M11.536 3.464a5 5 0 010 7.072L8 14.07l-3.536-3.535a5 5 0 117.072-7.072v.001zm1.06 8.132a6.5 6.5 0 10-9.192 0l3.535 3.536a1.5 1.5 0 002.122 0l3.535-3.536zM8 9a2 2 0 100-4 2 2 0 000 4z"></path></svg>
                    <span>${value.location}</span>
                </li>
                <li>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 273.5 222.3" class="octicon" height="16" width="16"><path d="M273.5 26.3a109.77 109.77 0 0 1-32.2 8.8 56.07 56.07 0 0 0 24.7-31 113.39 113.39 0 0 1-35.7 13.6 56.1 56.1 0 0 0-97 38.4 54 54 0 0 0 1.5 12.8A159.68 159.68 0 0 1 19.1 10.3a56.12 56.12 0 0 0 17.4 74.9 56.06 56.06 0 0 1-25.4-7v.7a56.11 56.11 0 0 0 45 55 55.65 55.65 0 0 1-14.8 2 62.39 62.39 0 0 1-10.6-1 56.24 56.24 0 0 0 52.4 39 112.87 112.87 0 0 1-69.7 24 119 119 0 0 1-13.4-.8 158.83 158.83 0 0 0 86 25.2c103.2 0 159.6-85.5 159.6-159.6 0-2.4-.1-4.9-.2-7.3a114.25 114.25 0 0 0 28.1-29.1" fill="currentColor"></path></svg>
                    <a class="twiter_link" href="https://twitter.com/${value.twitter_username}" target="_blank">@${value.twitter_username}</a>
                </li>
            </ul>
            <p>Количество репозиториев: ${value.public_repos}</p>
        </div>
    `;
    article.innerHTML = html;
    info.appendChild(article);
}

function loading() {
    spinner.style.display = 'block';
}








