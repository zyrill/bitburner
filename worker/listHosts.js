/** @param {NS} ns **/
export default function traverseNetwork(ns, host, hostList) {
	if (hostList.indexOf(host) == -1) {
		hostList.push(host);
		ns.scan(host).forEach(host => traverseNetwork(ns, host, hostList));
	}
	return hostList;
}

export async function main(ns) {
	ns.tprint(traverseNetwork(ns, "home", []));
}