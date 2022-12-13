import { Injectable } from '@nestjs/common';
import { Letter } from './letter.entity';

@Injectable()
export class TemplateBuilder {
	build(letters: Letter[], hideLetters: boolean): string {
		return `<!DOCTYPE html>
		<html>
			<head>
				<meta charset="utf-8" />
				<title>장지훈 인편게시판</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link
					href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
					rel="stylesheet"
					integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
					crossorigin="anonymous"
				/>
				<style type="text/css">
					@font-face {
						font-family: "Kyuri_diary";
						src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/naverfont_07@1.0/Kyuri_diary.woff")
							format("woff");
						font-weight: normal;
						font-style: normal;
					}
					body {
						font-family: "Kyuri_diary", sans-serif;
					}
		
					.text-align-right {
						text-align: right;
					}
		
					.name {
						font-size: 0.8rem;
					}
					.created-at {
						font-size: 0.8rem;
					}
				</style>
			</head>
			<body>
				<nav class="navbar navbar-dark bg-dark mb-3">
					<div class="container-fluid">
						<a class="navbar-brand" href="#">장지훈 인편게시판</a>
					</div>
				</nav>
		
				<div class="container">
					<form class="row g-3 mb-5" method="post">
						<div>
							<label for="name" class="form-label">작성자</label>
							<input type="text" class="form-control" id="name" name="name" />
						</div>
						<div>
						<label for="content" class="form-label">내용</label>
						<textarea class="form-control" id="content" name="content" rows="3"></textarea>
						</div>
						<div>
							<div class="form-check form-switch">
								<input type="hidden" id="hidden" name="hidden">
								<input class="form-check-input" type="checkbox" role="switch" id="hidden-box" name="hidden-box">
								<label class="form-check-label" for="hidden-box">비밀글</label>
							</div>
						</div>
						<div class="d-grid gap-2">
							<button type="submit" class="btn btn-outline-dark btn-sm">
								작성
							</button>
							<button type="button" onclick="copyUrl()" class="btn btn-outline-dark btn-sm">
								공유하기
							</button>
						</div>
					</form>

					${letters.map((letter) => this.createLetter(letter, hideLetters)).join('\n')}
					</div>
				</div>
		

				<script type="text/javascript">
					const message = document.location.search.split('message=')[1];
					if (message) {
						alert(decodeURIComponent(message), 'success');
					};

					function copyUrl() {
						const url = document.location.href.split('?')[0] + '?code=잘생긴지훈';
						const input = document.createElement('input');
						input.setAttribute('value', url);
						document.body.appendChild(input);
						input.select();
						const result = document.execCommand('copy');
						document.body.removeChild(input);
						if (result) {
							alert('링크가 복사되었습니다.');
						}
					}

					document.getElementById('hidden-box').onclick = (() => {
						const hidden = document.getElementById('hidden');
						hidden.value = !(hidden.value == 'true');
					});
				</script>
			
				<script
					src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"
					integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4"
					crossorigin="anonymous"
				></script>
			</body>
		</html>
		`;
	}

	private createLetter(
		{ name, content, createdAt, sended, hidden }: Letter,
		hideLetters: boolean,
	) {
		return `
		<div class="position-relative">
			<div class="shadow-lg p-3 mt-2 bg-body rounded float-right">
			<div>${
				hidden && hideLetters
					? lockIcon + ' 비밀글입니다.'
					: content.trim().replace(/\n/g, '<br>')
			}</div>
			<div class="text-align-right name">${
				hidden && hideLetters ? '비밀글' : name
			}</div>
			<div class="text-align-right created-at">${createdAt}</div>

			${
				sended
					? ''
					: `<span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
			발송전..
			<span class="visually-hidden">unread messages</span>
		</span>`
			}
			
		</div>
`;
	}
}

const lockIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-lock" viewBox="0 0 16 16">
<path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/>
</svg>`;
