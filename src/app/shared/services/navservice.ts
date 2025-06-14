import { Injectable, OnDestroy } from '@angular/core';
import { Subject, BehaviorSubject, fromEvent } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { AuthService } from './auth/auth.service';
import { ROLE_PATHS } from '../../core/config/role-config';

import { Router } from '@angular/router';
// Menu
export interface Menu {
	headTitle?: string;
	headTitle2?: string;
	path?: string;
	dirchange?: boolean;
	title?: string;
	icon?: string;
	type?: string;
	badgeValue?: string;
	badgeClass?: string;
	active?: boolean;
	selected?: boolean;
	bookmark?: boolean;
	children?: Menu[];
	Menusub?: boolean;
	target?: boolean;
	menutype?: string;
	badgeType?: string;
	roles?: string[];
}

@Injectable({
	providedIn: 'root',
})
export class NavService implements OnDestroy {
	private unsubscriber: Subject<any> = new Subject();
	public screenWidth: BehaviorSubject<number> = new BehaviorSubject(
		window.innerWidth
	);

	// Search Box
	public search = false;

	// Language
	public language = false;

	// Mega Menu
	public megaMenu = false;
	public levelMenu = false;
	public megaMenuColapse: boolean = window.innerWidth < 1199 ? true : false;

	// Collapse Sidebar
	public collapseSidebar: boolean = window.innerWidth < 991 ? true : false;

	// For Horizontal Layout Mobile
	public horizontal: boolean = window.innerWidth < 991 ? false : true;

	// Full screen
	public fullScreen = false;
	active: any;

	constructor(private router: Router, private authService: AuthService) {
		this.setScreenWidth(window.innerWidth);
		fromEvent(window, 'resize')
			.pipe(debounceTime(1000), takeUntil(this.unsubscriber))
			.subscribe((evt: any) => {
				this.setScreenWidth(evt.target.innerWidth);
				if (evt.target.innerWidth < 991) {
					this.collapseSidebar = true;
					this.megaMenu = false;
					this.levelMenu = false;
				}
				if (evt.target.innerWidth < 1199) {
					this.megaMenuColapse = true;
				}
			});
		if (window.innerWidth < 991) {
			// Detect Route change sidebar close
			this.router.events.subscribe((event) => {
				this.collapseSidebar = true;
				this.megaMenu = false;
				this.levelMenu = false;
			});
		}
	}

	ngOnDestroy() {
		this.unsubscriber.next;
		this.unsubscriber.complete();
	}

	// Ajoutez cette méthode pour filtrer les items selon le rôle
	getMenuItems(): Menu[] {
		const currentUser = this.authService.getCurrentUserValue;
		const role = this.authService.getCurrentUserRole();
		
		if (!role) {
		  console.warn('Aucun rôle utilisateur trouvé');
		  return []; // Ou retournez un menu par défaut si vous voulez
		}

		console.log('Rôle actuel:', role);
	
		return this.MENUITEMS.filter(item => {
		  // Si l'item n'a pas de propriété roles, il est visible pour tous les rôles authentifiés
		  if (!item.roles) return true;
		  
		  // Sinon, vérifiez si le rôle actuel est inclus
		  const isVisible = item.roles.map(r => r.toUpperCase()).includes(role);
		  console.log(`Item "${item.title}" visible: ${isVisible}`);
		  return isVisible;
		});
	  }
	
	  // Mettez à jour la méthode pour utiliser getMenuItems()
	  updateMenuItems() {
		this.items.next(this.getMenuItems());
	  }

	private setScreenWidth(width: number): void {
		this.screenWidth.next(width);
	}

	MENUITEMS: Menu[] = [
		// Dashboard
		{ headTitle: 'DASHBOARDS' },
		{
			title: 'Dashboards',
			icon: 'home',
			dirchange: false,
			type: 'sub',
			active: false,
			roles:['MANAGER'],
			children: [
						{
							title: 'Dashboard',
							dirchange: false,
							type: 'link',
							active: false,
							selected: false,
							path: '/dashboard/hrmdashboards/dashboard',
						},
						
				{
					title: 'Partners', type: 'sub', badgeType: 'success', badgeValue: '2', selected: false, active: false, children: [
				//  children: [
				// 		// { path: '/dashboard/employee-dashboard/dashboard', title: 'Dashboard', type: 'link', selected: false },
				//         // { path: '/dashboard/employee-dashboard/attendance', title: 'Attendance', type: 'link', selected: false },
						{ path: '/dashboard/hrmdashboards/employees/employee-list', title: 'Partners List', type: 'link', selected: false },
				// 		{ path: '/dashboard/hrmdashboards/employees/view-employee', title: 'View Partner', type: 'link', selected: false },
						{ path: '/dashboard/hrmdashboards/employees/add-employee', title: 'Add Partner', type: 'link', selected: false },
				// 	]
					]},
				{
					title: 'Contrat', type: 'sub', badgeType: 'success', badgeValue: '2', selected: false, active: false, children: [
						{ path: '/dashboard/hrmdashboards/department', title: 'Contrat List', type: 'link', selected: false },
						{ path: '/dashboard/project-dashboard/new-project', title: 'Add Contrat', type: 'link', selected: false },
						// { path: '/dashboard/project-dashboard/view-project', title: 'View Contrat', type: 'link', selected: false },
						// { path: '/dashboard/project-dashboard/overview-calendar', title: 'Overview Calendar', type: 'link', selected: false },
						
					]
				},
				
			],
		},
        {
			title: 'Partner', 
			icon: 'home', 
			type: 'sub', 
			active: false, 
			selected: false, 
			roles:['PARTNER'],
			children: [
				{ path: '/dashboard/employee-dashboard/dashboard', title: 'Dashboard', type: 'link', selected: false },
				// { path: '/dashboard/employee-dashboard/attendance', title: 'Attendance', type: 'link', selected: false },
				// { path: '/chat/chat', title: 'Chat', type: 'link', selected: false },
				{ path: '/dashboard/employee-dashboard/view-contract', title: 'Contract List', type: 'link', selected: false },
				// { path: '/dashboard/hrmdashboards/employees/view-employee', title: 'View Partner', type: 'link', selected: false },
				// { path: '/dashboard/hrmdashboards/employees/add-employee', title: 'Add Partner', type: 'link', selected: false },		
			]
		},
		{
			title: 'Admin', 
			icon: 'airplay', 
			type: 'sub', 
			active: false, 
			selected: false, 
			roles:['ADMIN'],
			children: [
				{ path: '/admin/dashboard', title: 'Dashboard', type: 'link', selected: false },
				{ path: '/admin/role-access', title: 'Role Access', type: 'link', selected: false },
				{ path: '/admin/contract-list', title: 'Contract-list', type: 'link', selected: false },
				{ path: '/admin/register-list', title: 'pending Users', type: 'link', selected: false },
				// { path: '/admin/general-settings', title: 'General Settings', type: 'link', selected: false },
				// { path: '/admin/api-settings', title: 'Api Settings', type: 'link', selected: false },
				// { path: '/dashboard/super-admin/settings', title: 'Settings', type: 'link', selected: false },
			]
		},

	];
	// Array
	items = new BehaviorSubject<Menu[]>(this.MENUITEMS);

	
}
