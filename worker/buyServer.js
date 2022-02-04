/** @param {NS} ns **/
export async function main(ns) {
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

	// Check price of server and if sufficient funds are available, buy it.
	// If not, try again with half the amount of RAM and recurse.
	function buyServer(purchaseServerRam) {
		if (ns.getServerMoneyAvailable('home') > ns.getPurchasedServerCost(purchaseServerRam)) {
			// Buy unless no more servers can be bought and server would be smaller
			if (purchasedServers.length < ns.getPurchasedServerLimit) {
				return ns.purchaseServer(crypto.randomUUID(),purchaseServerRam);
			} else if (purchaseServerRam > minimalServerRam) {
				// Find server with minimal RAM and replace it
				for (const server of purchasedServers) {
					if (ns.getServerMaxRam(server) == minimalServerRam) {
						ns.deleteServer(ns.getHostname(server));
						break;
					}
				}
				return ns.purchaseServer(crypto.randomUUID(),purchaseServerRam);
			} else {
				ns.toast("Server would be a downgrade, aborting buy.","error",10000);
			}
		}
		else {
			buyServer(purchaseServerRam/2);
		}
	}
	
	buyServer(ns.getPurchasedServerMaxRam());
}