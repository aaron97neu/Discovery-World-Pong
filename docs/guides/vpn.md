Both the exhibit itself and its testing twins reside behind NATs that do not allow remote developers or Github Actions to access.
As such, we ether must add port forwarding to the NAT boxes or use a NAT buster.
As the exhibit maintainers are not guarenteed (and in this case do not) have administrative control over the NAT box.
Therefore, we will use a VPN.
As the developers at the time of VPN implementation had expirence with OpenVPN, this was chosen.
Any other vpn solution can work with minimal modifications to the `deploy.yml` GitHub action.
A VPN "Bounce Server" was deployed on Azure with a public IP. From there, an OpenVPN community server was installed and setup.
The server was modified to assign static IPs to the exhibit and twins using `client-config-dir`.
From there client configs were distributed to top level developers and added to the repository secrets for GitHub Actions.
