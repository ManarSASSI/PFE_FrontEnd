import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  inject,
} from '@angular/core';
import { Menu, NavService } from '../../services/navservice';
import { AuthService } from '../../services/auth/auth.service';
import { SwitcherComponent } from '../switcher/switcher.component';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { AppStateService } from '../../services/app-state.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { RightSidebarComponent } from '../right-sidebar/right-sidebar.component';
import { AlertService } from '../../services/alert/alert.service';
import { MessageService } from '../../services/message/message.service';
interface Item {
  id: number;
  name: string;
  type: string;
  title: string;
  // Add other properties as needed
}
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  userName: string = 'User';
  notificationCount = 0;
  alerts: any[] = [];
  currentManagerId: number | null = null;

  isMessagesOpen = false;
  messages: any[] = [];
  cartItemCount: number = 0;
  public isCollapsed = true;
  collapse: any;
  closeResult = '';
  themeType: string | undefined;

  selectedItem: string  | null ='selectedItem'
  isOpen: boolean = false;
modal: any;
  constructor(
    private appStateService: AppStateService,
    public authService: AuthService,
    public navServices: NavService,
    private elementRef: ElementRef,
    public renderer: Renderer2,
    public modalService:NgbModal,
    private router: Router, private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    private messageService: MessageService
  ) {this.localStorageBackUp()}

  private offcanvasService = inject(NgbOffcanvas);

  logout(): void {
    this.authService.logout(); // Appel de la méthode existante
    this.router.navigate(['/auth/login']); // Redirection optionnelle (déjà dans le service)
  }

  

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }

  handleItemClick(title: string) {
    this.selectedItem = title;
    this.isOpen = false;
    localStorage.setItem('selectedItem', title);
  }
  open() {
    this.offcanvasService.open(SwitcherComponent, {
      position: 'end',
      scroll: true,
      panelClass:'switcher-canvas-width'
    });
  }
  
  openModal(content: any) {
    this.modalService.open(content);
  }
  openSearch(search: any) {
    // this.modalService.open(search);
  }
  toggleSidebar() {
    let html = this.elementRef.nativeElement.ownerDocument.documentElement;
    if (html?.getAttribute('data-toggled') == 'true') {
      document.querySelector('html')?.getAttribute('data-toggled') ==
        'icon-overlay-close';
        html?.setAttribute('data-toggled', window.innerWidth <= 992 ? 'close' : '');
    }
    else if (html?.getAttribute('data-nav-style') == 'menu-click') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'menu-click-closed'
          ? ''
          : 'menu-click-closed'
      );
    } else if (html?.getAttribute('data-nav-style') == 'menu-hover') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'menu-hover-closed'
          ? ''
          : 'menu-hover-closed'
      );
    } else if (html?.getAttribute('data-nav-style') == 'icon-click') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'icon-click-closed'
          ? ''
          : 'icon-click-closed'
      );
    } else if (html?.getAttribute('data-nav-style') == 'icon-hover') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'icon-hover-closed'
          ? ''
          : 'icon-hover-closed'
      );
    }
    else if (html?.getAttribute('data-vertical-style') == 'overlay') {
      html?.setAttribute(
        'data-vertical-style','overlay' 
      );
      html?.setAttribute(
        'data-toggled', html?.getAttribute('data-toggled') == 'icon-overlay-close'
        ? ''
        : 'icon-overlay-close'
      );
    } else if (html?.getAttribute('data-vertical-style')  == 'overlay') {
      document.querySelector('html')?.getAttribute('data-toggled') != null
        ? document.querySelector('html')?.removeAttribute('data-toggled')
        : document
            .querySelector('html')
            ?.setAttribute('data-toggled', 'icon-overlay-close');
    } else if (html?.getAttribute('data-vertical-style') == 'closed') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'close-menu-close'
          ? ''
          : 'close-menu-close'
      );
    } else if (html?.getAttribute('data-vertical-style') == 'icontext') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'icon-text-close'
          ? ''
          : 'icon-text-close'
      );
    } else if (html?.getAttribute('data-vertical-style') == 'detached') {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'detached-close'
          ? ''
          : 'detached-close'
      );
    }else if (html?.getAttribute('data-vertical-style') == 'doublemenu') {
      html?.setAttribute('data-toggled', html?.getAttribute('data-toggled') == 'double-menu-close' && document.querySelector(".slide.open")?.classList.contains("has-sub")? 'double-menu-open': 'double-menu-close' );
    } 

    if (window.innerWidth <= 992) {
      html?.setAttribute(
        'data-toggled',
        html?.getAttribute('data-toggled') == 'open' ? 'close' : 'open'
      );
    }
  }
  updateTheme(theme: string) {
    this.appStateService.updateState({ theme, menuColor: theme, headerColor: theme });
    if (theme == 'light') {
      this.appStateService.updateState({ theme, themeBackground: '', headerColor: 'light', menuColor: 'dark' });
      let html = document.querySelector('html');
      html?.style.removeProperty('--body-bg-rgb');
      html?.style.removeProperty('--body-bg-rgb2');
      html?.style.removeProperty('--light-rgb');
      html?.style.removeProperty('--form-control-bg');
      html?.style.removeProperty('--input-border');
      html?.setAttribute('data-toggled', 'close');
      html?.setAttribute('data-toggled', window.innerWidth <= 992 ? 'close' : '');
    }
    if (theme == 'dark') {
      this.appStateService.updateState({ theme, themeBackground: '', headerColor: 'dark', menuColor: 'dark' });
      let html = document.querySelector('html');
      html?.style.removeProperty('--body-bg-rgb');
      html?.style.removeProperty('--body-bg-rgb2');
      html?.style.removeProperty('--light-rgb');
      html?.style.removeProperty('--form-control-bg');
      html?.style.removeProperty('--input-border');
      html?.setAttribute('data-toggled', 'close');
      html?.setAttribute('data-toggled', window.innerWidth <= 992 ? 'close' : '');
    }
  }
 

  localStorageBackUp() {
    let styleId = document.querySelector('#style');
  
    let html = document.querySelector('html');
    //Theme Color Mode:
    if (localStorage.getItem('headerColor') == 'dark') {
      if (localStorage.getItem('theme')) {
        const type: any = localStorage.getItem('theme');
        html?.setAttribute('data-theme-mode', type);
        html?.setAttribute('data-header-styles', type);
        html?.setAttribute('data-menu-styles', type);
      }
      if (localStorage.getItem('theme') == 'light') {
        const type: any = localStorage.getItem('theme');
        html?.setAttribute('data-theme-mode', type);
        html?.setAttribute('data-header-styles', type);
        html?.setAttribute('data-menu-styles', type);
      }
    }
  }
  isCartEmpty: boolean = false;
  isNotifyEmpty: boolean = false;

  removeRow(rowId: string) {
    const rowElement = document.getElementById(rowId);
    if (rowElement) {
      rowElement.remove();
    }
    this.cartItemCount--;
    this.isCartEmpty = this.cartItemCount === 0;
  }

  handleCardClick(event: MouseEvent) {
    // Prevent the click event from propagating to the container
    event.stopPropagation();
  }

  // Search
  public menuItems!: Menu[];
  public items!: Menu[];
  public text!: string;
  public SearchResultEmpty: boolean = false;

  ngOnInit(): void {
    this.loadMessages();
    const userData = localStorage.getItem('currentUser');
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        this.userName = user.username || 'User';
        this.currentManagerId = user.id;
        this.loadManagerAlerts();
        
      } catch (e) {
        console.error('Erreur de parsing des données utilisateur', e);
      }
    }
    const storedSelectedItem = localStorage.getItem('selectedItem');
    // this.updateSelectedItem();
  // If there's no selected item stored, set a default one
  if (!storedSelectedItem) {
    this.selectedItem = "Sales Dashboard"; // You can set any default item here
    localStorage.setItem('selectedItem', this.selectedItem);
  } else {
    this.selectedItem = storedSelectedItem;
  }
    this.navServices.items.subscribe((menuItems) => {
      this.items = menuItems;
    });
    // To clear and close the search field by clicking on body
    document.querySelector('.main-content')?.addEventListener('click', () => {
      this.clearSearch();
    });
    this.text = '';
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.updateSelectedItem();
    });

  }

// messages

private loadMessages() {
    const user = JSON.parse(localStorage.getItem('currentUser')!); // À implémenter dans AuthService
    this.messageService.getUserMessages(user.id).subscribe({
      next: (messages) => {
        this.messages = messages;
        this.cartItemCount = messages.length;
        this.isCartEmpty = this.cartItemCount === 0;
      },
      error: (err) => console.error('Erreur chargement messages', err)
    });
  }


  removeMessage(messageId: number) {
    this.messageService.deleteMessage(messageId).subscribe({
      next: () => {
        this.messages = this.messages.filter(msg => msg.id !== messageId);
        this.cartItemCount = this.messages.length;
        this.isCartEmpty = this.cartItemCount === 0;
      },
      error: (err) => console.error('Erreur suppression message', err)
    });
  }


  // 
  
  private updateSelectedItem() {
    const dashboard = this.activatedRoute.snapshot.firstChild?.url[0]?.path;
    this.selectedItem = dashboard ? dashboard.charAt(0).toUpperCase() + dashboard.slice(1) + ' Dashboard' : this.selectedItem;
  }
  ngOnDestroy(): void {
    const windowObject: any = window;
    let html = this.elementRef.nativeElement.ownerDocument.documentElement;
 
    window.addEventListener('resize', () => {
      if (localStorage.getItem('valexverticalstyles') != 'icon-text-close') {
        if (windowObject.innerWidth <= '991') {
          html?.setAttribute('data-toggled', 'open');
        } else {
          if (!(localStorage.getItem('valexverticalstyles') == 'doublemenu')) {
            html?.removeAttribute('data-toggled');
          }
        }
      } else {
        document
          .querySelector('html')
          ?.setAttribute('data-toggled', 'icon-text-close');
      }
    });

   
  }
  Search(searchText: string) {
    if (!searchText) return this.menuItems = [];
    // items array which stores the elements
    const items:Item[] = [];
    // Converting the text to lower case by using toLowerCase() and trim() used to remove the spaces from starting and ending
    searchText = searchText.toLowerCase().trim();
    this.items.filter((menuItems:Menu) => {
      // checking whether menuItems having title property, if there was no title property it will return
      if (!menuItems?.title) return false;
      //  checking wheteher menuitems type is text or string and checking the titles of menuitems
      if (menuItems.type === 'link' && menuItems.title.toLowerCase().includes(searchText)) {
        // Converting the menuitems title to lowercase and checking whether title is starting with same text of searchText
        if( menuItems.title.toLowerCase().startsWith(searchText)){ // If you want to get all the data with matching to letter entered remove this line(condition and leave items.push(menuItems))
          // If both are matching then the code is pushed to items array
          items.push(menuItems as Item);
        }
      }
      //  checking whether the menuItems having children property or not if there was no children the return
      if (!menuItems.children) return false;
      menuItems.children.filter((subItems:Menu) => {
        if (!subItems?.title) return false; 
        if (subItems.type === 'link' && subItems.title.toLowerCase().includes(searchText)) {
          if( subItems.title.toLowerCase().startsWith(searchText)){         // If you want to get all the data with matching to letter entered remove this line(condition and leave items.push(subItems))
            items.push(subItems as Item);
          }

        }
        if (!subItems.children) return false;
        subItems.children.filter((subSubItems:Menu) => {
          if (subSubItems.title?.toLowerCase().includes(searchText)) {
            if( subSubItems.title.toLowerCase().startsWith(searchText)){ // If you want to get all the data with matching to letter entered remove this line(condition and leave items.push(subSubItems))
              items.push(subSubItems as Item);
              
            }
          }
        });
        return true;
      });
      return this.menuItems = items;
    });
    // Used to show the No search result found box if the length of the items is 0
    if(!items.length){
      this.SearchResultEmpty = true;
    }
    else{
      this.SearchResultEmpty = false;
    }
    return true;
  }
  SearchModal(SearchModal: any) {
    this.modalService.open(SearchModal);
  }
  //  Used to clear previous search result
  clearSearch() {    
    const headerSearch = document.querySelector('.header-search');
    if (headerSearch) {
        headerSearch.classList.remove('searchdrop');
    }
    this.text = '';
    this.menuItems = [];
    this.SearchResultEmpty = false;
    return this.text, this.menuItems;
    
  }
  SearchHeader() {
    document
    .querySelector('.header-search')
    ?.classList.toggle('searchdrop');
  }
  isInputFocused: boolean = false;

  onInputFocus() {
    this.isInputFocused = true;
  }

  onInputBlur() {
    this.isInputFocused = false;
  }

  isFullscreen: boolean = false;
  toggleFullscreen() {
    this.isFullscreen = !this.isFullscreen;
  }

  private loadManagerAlerts() {
    this.alertService.getAlertsForManager(this.currentManagerId!).subscribe({
      next: (alerts) => {
        this.alerts = alerts;
        this.notificationCount = this.alerts.filter(alert => !alert.read).length;
      },
      error: (err) => console.error('Error loading alerts', err)
    });

    this.alertService.getUserAlerts().subscribe({
      next: (alerts) => {
        this.alerts = alerts;
        this.notificationCount = this.alerts.filter(alert => !alert.read).length;
      },
      error: (err) => console.error('Error loading alerts', err)
    });
  }

  openNotifications() {
    this.offcanvasService.open(RightSidebarComponent, {
    position: 'end',
    scroll: true,
    panelClass: 'notification-sidebar-width'
  }).componentInstance.alerts = this.alerts;
  }

  markAsRead(alertId: number) {
    this.alertService.markAsRead(alertId).subscribe({
      next: () => {
        const alert = this.alerts.find(a => a.id === alertId);
        if (alert) {
          alert.read = true;
          this.notificationCount--;
        }
      },
      error: (err) => console.error('Error marking alert as read', err)
    });
  }


}
