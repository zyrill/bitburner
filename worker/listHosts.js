/** @param {NS} ns **/
export async function main(ns) {
	var hostList = [];

	function traverseNetwork(host) {
		if (hostList.indexOf(host) == -1) {
			hostList.push(host);
			ns.scan(host).forEach(host => traverseNetwork(host));
		}
	}

	traverseNetwork("home");

	ns.tprint(hostList);
}