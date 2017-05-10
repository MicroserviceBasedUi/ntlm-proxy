const Link = link => {
    return `<a ng-class="{'active': location.path() == '/'}" href="/" class="active">${link}</a>`;
};


class Profile extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    render() {
        // Fetch profile data from insight
        fetch('http://localhost:9001/user').then(r => {
            return r.json();
        }).then(user => {
            this.getElementsByClassName('profile-image')[0].setAttribute('src', `http://localhost:9001/employees/${user.Id}/picture`);
            this.getElementsByClassName('profile-name')[0].innerHTML = `${user.FirstName} ${user.LastName}`;
            this.getElementsByClassName('profile-title')[0].innerHTML = user.Title;
        });

        this.innerHTML = `
        <div class="navbar-header pull-right" style="position: absolute; right: 20px; top: 10px;">
            <div ng-show="user" class="pull-right">
            <div class="btn-group" dropdown="">
                <button type="button" class="btn btn-white dropdown-toggle" dropdown-toggle="" style="background: transparent; padding: 1px; text-align: left;"
                aria-haspopup="true" aria-expanded="false">
                                    <img class="pull-left img-circle profile-image" style="width: 40px; height: 40px; margin: 4px;"  >
                                    <div class="pull-left ng-binding" style="padding: 5px 10px;">
                                        <strong class="ng-binding profile-name"></strong>&nbsp;<!-- ngIf: isExternalMode() --><br>
                                        <span class="profile-title"></span><span ng-show="user.Title.length > 40" class="ng-hide">...</span>&nbsp;<span class="caret"></span>
                                    </div>
                                </button>
                <ul class="dropdown-menu pull-right" role="menu">
                <li><a href="/employees/aca"><i class="fa fa-user"></i>&nbsp; My Profile</a></li>
                <li class="divider"></li>
                <li><a href="/settings"><i class="fa fa-gear"></i>&nbsp; Settings</a></li>
                <li><a href="/settings"><i class="fa fa-bell-o"></i>&nbsp; Alerts</a></li>
                <li class="divider"></li>
                <li><a href="#" ng-click="toggleExternalMode()" title="No sensitive data is shown. Can be used for demos or at customer site."><i class="fa fa-lock" ng-class="isExternalMode() ? 'fa-check' : 'fa'"></i>&nbsp; Customer Demo Mode</a></li>
                <li class="divider"></li>
                <li><a href="#" ng-click="sendFeedback()"><i class="fa fa-envelope-o"></i>&nbsp; Send Feedback</a></li>
                <li><a href="/about">About Zühlke Insight</a></li>
                </ul>
            </div>
            </div>
        </div>`;
    }
}

class Header extends HTMLElement {
    connectedCallback() {
        this.render(['Home', 'Employees']);
    }

    render(links) {
        this.innerHTML = ` <div class="nav-panel" style="border-bottom-color: #d3d3d3;">
        <div class="clearfix">
            <a class="pull-left" href="/"><img style="margin-top: 7px;" src="http://localhost:9000/insight/logo.png"></a>
            <div class="pull-left" style="position: relative;">
                <input id="search-input" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" class="search-box"
                    type="text" placeholder="Search...">
                <img ng-hide="term.length" style="left: 584px; top: 20px; position: absolute; z-index: 99; opacity: 0.5" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAF6SURBVEhLtZW/LwRBFMfXj0KhuEJCoVBKyEVCQiU6JAp/gM4VCj2F/0EholTQK5UKEgoSokBFQkIi0VCIhs93Zsju5nZ2Zu98kk9m3uX23tuXN3PJf9Pl1iK6sY4LOO3iN/zCIDrdmqcXt/DZrSPYj2t4j4c4hJWYwBvcxB590IQGPuKSiSJQVXpwxkR+9F0VovYFof4e46qJwhhDFdRnohJWUL2NZR137NbPHkb3FAbx2m796EujdhvNK2ryvHy7tQpHOGW3WdLn4An1ulXQcw92myWd4Bx1BmKpOV9MlCOd4BJn7TaKOTyzWz+qQtdA014W8PtM8HCoGp1OPViGDqZGW1dKFBuoqnxXwDCeoiZPp79wRDvcmkdt2kVNlvp7gZ+oVkyihmEbl1HJTnAePzBDUQKhqnTp6b4Zd/EtXuE+KuEA6gx4k7SKCjhAtUur4j/K/tFC0Pzfod5m0a2KzbloRwLhTdJO9MMa83escisEoSQxh7UVkuQHzwZCzk8DQZQAAAAASUVORK5CYII="
                    width="20" height="20">
                <div id="search-panel" class="drop-shadow" style="display: none; background: white; width: 1120px; z-index: 299; position: absolute; top: 50px; left: 20px; padding: 10px;">
                    <!-- ngRepeat: group in results track by $index -->
                </div>
            </div>
        </div>
        <div class="nav-modules">
            ${links.map(Link).join('')}
            <a ng-class="{'active': location.path().indexOf('/groups') > -1}" href="/groups/search" class="">Groups</a>
            <a ng-class="{'active': location.path().indexOf('/trainings') > -1}" href="/trainings">Trainings</a>
            <a ng-class="{'active': location.path().indexOf('/projects') > -1}" href="/projects/search">Projects</a>
            <a ng-class="{'active': location.path().indexOf('/project-phases') > -1}" href="/project-phases/search">Phases</a>
            <a ng-class="{'active': location.path().indexOf('/career') > -1 || location.path().indexOf('/career') > -1}" href="/career">Career</a>
            <a ng-class="{'active': location.path().indexOf('/adm') > -1}" href="/adm">Deliverables &amp; Capabilities</a>
            <div class="dropdown" style="display: inline-block;">
                <a href="#" data-toggle="dropdown">More</a>
                <ul class="dropdown-menu">
                    <li><a href="/assets/search">Reusable Assets</a></li>
                    <li><a href="/customers/search">Customers</a></li>
                    <li><a href="/contacts/search">Contacts</a></li>
                    <li><a href="/solutions/search">Solutions</a></li>
                    <li><a href="/skills/search">Skills</a></li>
                    <li><a href="/media">Offering Material</a></li>
                </ul>
            </div>
        </div>
    </div>
    <insight-profile></insight-profile>
    `;
    }
}

customElements.define('insight-header', Header);
customElements.define('insight-profile', Profile);
