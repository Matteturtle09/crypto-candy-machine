function Navbar() {

    return (
        <div className="navbar bg-secondary">
            <div className="flex-1">
                <a className="btn btn-ghost text-base-100 normal-case text-xl">Cryptandy</a>
            </div>
            <div className="flex-none navbar-end">
                <a className="btn btn-accent normal-case text-xl text-base-100">Connect</a>
            </div>
        </div>
    )
}

export default Navbar;