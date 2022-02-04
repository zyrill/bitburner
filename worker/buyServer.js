/** @param {NS} ns **/
// Check price of server and if sufficient funds are available, buy it.
// If not, try again with half the amount of RAM and recurse.
export default function buyServer(ns, purchaseServerRam) {
	// Find RAM size of smallest server
	var purchasedServers = ns.getPurchasedServers();
	var minimalServerRam = 0;
	if (purchasedServers.length > 0) {
		minimalServerRam = ns.getServerMaxRam(purchasedServers[0]);
		for (var i = 1; i < purchasedServers.length; ++i) {
			if (ns.getServerMaxRam(purchasedServers[i]) < minimalServerRam) {
				minimalServerRam = ns.getServerMaxRam(purchasedServers[i]);
			}
		}
	}
	// Check if sufficient funds are available for the favoured purchase
	if (ns.getServerMoneyAvailable('home') > ns.getPurchasedServerCost(purchaseServerRam)) {
		// Buy unless no more servers can be bought and server would be smaller
		if (purchasedServers.length < ns.getPurchasedServerLimit) {
			const serverName = crypto.randomUUID();
			ns.purchaseServer(serverName, purchaseServerRam);
			return serverName;
		} else if (purchaseServerRam > minimalServerRam) {
			// Find server with minimal RAM and replace it with new server
			for (const server of purchasedServers) {
				if (ns.getServerMaxRam(server) == minimalServerRam) {
					ns.killall(server);
					ns.deleteServer(server);
					break;
				}
			}
			const serverName = crypto.randomUUID();
			ns.purchaseServer(serverName, purchaseServerRam);
			return serverName;
		}
	}
	else {
		buyServer(ns, purchaseServerRam / 2);
	}
}

export async function main(ns) {
	buyServer(ns, ns.getPurchasedServerMaxRam());
}