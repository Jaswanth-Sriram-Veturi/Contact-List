import Trie from './Trie.js';

onload = function() {
	const templates = document.getElementsByTagName('template')[0];
	const contactItem = templates.content.querySelector('div');
	const add = document.getElementById('add');
	const contactInfo = document.getElementById('contact-input');
	const del = document.getElementById('del');
	const deleteInfo = document.getElementById('delete-input');
	const contacts = document.querySelector('span.contacts');
	const searchInput = document.getElementById('search');
	const contactList = new Trie();

	const createContactItem = ({ name, number }) => {
		let contactListItem = document.getElementsByTagName('template')[1].content.querySelector('div').cloneNode(true);
		contactListItem.querySelector('#Name').innerText = name;
		contactListItem.querySelector('#Number').innerText = number;
		contacts.insertAdjacentElement('beforeend', contactListItem);
	};

	contactList.findNext(-2).contacts.map((el) => createContactItem(el));

	const deleteContactItem = (el) => {
		let contactItems = this.document.querySelectorAll('div.contact-items');
		contactItems.forEach((item) => {
			if (item.children[1].children[1].innerText === el) {
				item.setAttribute('class', 'contact-items remove');
				this.document.querySelector('div.contact-items.remove').remove();
			}
		});
	};

	add.onclick = function() {
		let details = contactInfo.value;
		details = details.split('-');
		if (details.length !== 2) {
			alert('Incorrectly formatted input');
			return;
		}
		details[0] = details[0].trim();
		details[1] = details[1].trim();
		if (details[1].length !== 10) {
			alert('Number should be exactly 10 digits');
			return;
		}
		contactList.add(details[1], details[0]);
		createContactItem({ name: details[0], number: details[1] });
		contactInfo.value = '';
	};

	del.onclick = function() {
		let details = deleteInfo.value.trim();
		if (details.length !== 10) {
			alert('Number should be exactly 10 digits');
			return;
		}
		contactList.del(details);
		deleteContactItem(details);
		deleteInfo.value = '';
	};

	contactItem.cloneNode(true);

	let autocomplete = (inp) => {
		let currentFocus;
		inp.input = '';

		inp.addEventListener('input', function(e) {
			let a,
				val = this.value;

			closeAllLists();

			if (val.length >= 11) {
				alert('Number cannot be more than 10 digits');
				return;
			}

			currentFocus = -1;

			a = document.createElement('div');

			a.setAttribute('id', this.id + 'autocomplete-list');
			a.setAttribute('class', 'autocomplete-items list-group text-left');

			this.parentNode.appendChild(a);

			let arr = [];
			if (val.length === this.input.length) {
				arr = contactList.findNext(-2).res;
			} else if (val.length < this.input.length) {
				this.input = val;
				arr = contactList.findNext(-1).res;
			} else {
				this.input = val;
				arr = contactList.findNext(this.input[this.input.length - 1]).res;
			}

			for (let i = 0; i < Math.min(arr.length, 6); i++) {
				let item = contactItem.cloneNode(true);
				item.querySelector('#Name').innerText = arr[i].name;
				item.querySelector('#Number').innerHTML =
					'<strong>' + arr[i].number.substr(0, val.length) + '</strong>' + arr[i].number.substr(val.length);
				item.number = arr[i].number;

				item.addEventListener('click', function(e) {
					inp.value = '';
					closeAllLists();
					alert('Calling ' + item.number);
				});
				a.appendChild(item);
			}
		});

		inp.addEventListener('keydown', function(e) {
			let autoCompleteList = document.getElementById(this.id + 'autocomplete-list');
			if (autoCompleteList) autoCompleteList = autoCompleteList.getElementsByTagName('div');
			if (e.keyCode === 40) {
				currentFocus++;
				addActive(autoCompleteList);
			} else if (e.keyCode === 38) {
				currentFocus--;
				addActive(autoCompleteList);
			} else if (e.keyCode === 13) {
				e.preventDefault();
				if (currentFocus > -1) {
					if (autoCompleteList) autoCompleteList[currentFocus * 2].click();
				}
			}
		});

		let addActive = (x) => {
			if (!x) return false;
			removeActive(x);
			if (currentFocus >= x.length) currentFocus = 0;
			if (currentFocus < 0) currentFocus = x.length - 1;
			x[currentFocus * 2].classList.add('active');
		};

		let removeActive = (x) => {
			for (let i = 0; i < x.length; i++) {
				x[i].classList.remove('active');
			}
		};

		let closeAllLists = (elmnt) => {
			const x = document.getElementsByClassName('autocomplete-items');

			for (let i = 0; i < x.length; i++) {
				if (elmnt !== x[i] && elmnt !== inp) {
					x[i].parentNode.removeChild(x[i]);
				}
			}
		};

		document.addEventListener('click', function(e) {
			closeAllLists(e.target);
		});
	};

	autocomplete(searchInput);
};
