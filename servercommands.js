/** @param {NS} ns */
export async function main(ns) {
	if (ns.args[0] === "budget") {
		if (ns.args[1] == null) {
			var budget = ns.getServerMoneyAvailable("home");
		} else {
			var budget = ns.args[1];
		}
		for (var i = 0; i < 21; i++) {
			if (ns.getPurchasedServerCost(2 ** i) >= budget) {
				break;
			}
		}
		ns.tprint("");
		if (1024 > 2 ** (i - 1)) {
			ns.tprint(2 ** (i - 1), " GB is the max size purchaseable.");
			ns.tprint("$", Math.ceil(ns.getPurchasedServerCost(2 ** i)), " is the $ needed to purchase a ", 2 ** i, "GB server.");
		} else if (1048576 > 2 ** (i - 1)) {
			ns.tprint("Inputted Dollar amount: $", ns.args[1], ". ", (2 ** (i - 1)) / 1024, " TB is the max size purchaseable (", 2 ** (i - 1), " GB).");
			ns.tprint("$", Math.ceil(ns.getPurchasedServerCost(2 ** i)), " is the $ needed to purchase a ", (2 ** i) / 1024, "TB server (", 2 ** i, " GB).");
		} else {
			ns.tprint("You own $", Math.round(ns.getServerMoneyAvailable("home")), ". The 1 PB (1048576 GB) limit can be achieved ($", Math.ceil(ns.getPurchasedServerCost(2 ** 20)), ").");
		}
	} else if (ns.args[0] === "buy") {
		if (ns.purchaseServer(ns.args[1], ns.args[2])) {
			ns.tprint("");
			ns.tprint("Successfully purchased server: ", ns.args[1], " at ", ns.args[2], " GB ", "(", ns.args[2] / 1024, " TB", ")");
		} else {
			ns.tprint("");
			ns.tprint("Purchase failed: ensure that RAM amount is in increments of 2^n, or that you have space for another server purchase.");
		}
	} else if (ns.args[0] === "maxbuy") {
		for (var i = 0; i < 21; i++) {
			if (ns.getPurchasedServerCost(2 ** i) >= ns.getServerMoneyAvailable("home")) {
				break;
			}
		}
		var serverarray = ns.getPurchasedServers();
		if (serverarray[24] == null) {
			ns.purchaseServer(ns.args[1], 2 ** (i - 1));
			ns.tprint("");
			ns.tprint("Successfully purchased server: ", ns.args[1], " at ", 2 ** (i - 1), " GB ", "(", 2 ** (i - 1) / 1024, " TB", ")");
		} else {
			ns.tprint("");
			ns.tprint("Purchase failed: The 25 server purchase limit has already been reached; delete a server.");
		}
	} else if (ns.args[0] === "delete") {
		if (ns.deleteServer(ns.args[1])) {
			ns.tprint("");
			ns.tprint(ns.args[1], " successfully deleted");
		} else {
			ns.tprint("");
			ns.tprint("Error: server does not exist.");
		}
	} else if (ns.args[0] === "help") {
		ns.tprint("");
		ns.tprint("run server.js budget [dollar amount] <<(Optional)    Shows the largest size a server can be purchased for. Leave blank to calculate based on current money.");
		ns.tprint("");
		ns.tprint("run server.js buy [server name] [server size]        Purchases a server with the given name and size.");
		ns.tprint("");
		ns.tprint("run server.js maxbuy [server name]                   Purchases a server at maximum size possible using all money available.");
		ns.tprint("");
		ns.tprint("run server.js delete [server name]                   Deletes the specified server.");
		ns.tprint("");
	} else {
		ns.tprint("");
		ns.tprint('Error: for a list of valid arguments, type "run server.js help".');
	}
}