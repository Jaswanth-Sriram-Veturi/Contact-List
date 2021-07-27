class TrieNode {
	constructor() {
		this.children = Array(10).fill(null);
		this.parent = null;
	}
}

class ContactNode {
	constructor(name, number, parent) {
		this.name = name;
		this.number = number;
		this.parent = parent;
	}
}

class Trie {
	constructor() {
		this.root = new TrieNode();
		this.current = this.root;

		let init = [
			[ 'Jaswanth', '1234567890' ],
			[ 'Sriram', '1235467120' ],
			[ 'Ram', '1236541962' ],
			[ 'Sid', '1234651954' ],
			[ 'Siddhu', '1239805102' ]
		];

		for (let i = 0; i < init.length; i++) {
			this.add(init[i][1], init[i][0], 0);
		}
	}

	add(number, name, pos = 0, node = this.root) {
		if (pos === number.length - 1) {
			node.children[number[pos] - '0'] = new ContactNode(name, number, node);
			return;
		}

		if (node.children[number[pos] - '0'] === null) {
			let newnode = new TrieNode();
			node.children[number[pos] - '0'] = newnode;
			newnode.parent = node;
		}
		this.add(number, name, pos + 1, node.children[number[pos] - '0']);
	}

	findAll(node) {
		if (node === null) return;

		if (node instanceof ContactNode) {
			this.res.push(node);
			this.contacts.push(node);
			return;
		}

		for (let i = 0; i < 10; i++) {
			this.findAll(node.children[i]);
		}
	}

	findNext(step) {
		if (step === -1) {
			this.current = this.current.parent;
		} else if (step !== -2) {
			if (this.current.children[step - '0'] === null) {
				let newnode = new TrieNode();
				this.current.children[step - '0'] = newnode;
				newnode.parent = this.current;
			}

			this.current = this.current.children[step - '0'];
		}

		this.res = [];
		this.contacts = [];
		this.findAll(this.current);
		return { res: this.res, contacts: this.contacts };
	}

	del(number, pos = 0, node = this.root) {
		if (pos === number.length - 1) {
			node.children[number[pos] - '0'] = null;
			return;
		}

		if (node.children[number[pos] - '0'] === null) {
			let newnode = new TrieNode();
			node.children[number[pos] - '0'] = newnode;
			newnode.parent = node;
		}

		this.del(number, pos + 1, node.children[number[pos] - '0']);
	}
}

export default Trie;
