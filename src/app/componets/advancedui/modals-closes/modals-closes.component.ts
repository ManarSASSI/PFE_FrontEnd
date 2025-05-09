import { Component, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalConfig,NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../shared/common/sharedmodule';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { ShowcodeCardComponent } from '../../../shared/common/includes/showcode-card/showcode-card.component';
import * as prismCodeData from '../../../shared/prismData/advancedUi/models'
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-modals-closes',
  standalone: true,
  imports: [SharedModule,NgbTooltipModule,NgbPopoverModule, ShowcodeCardComponent,RouterModule],
  templateUrl: './modals-closes.component.html',
  styleUrl: './modals-closes.component.scss',
  providers: [NgbModalConfig, NgbModal],
  encapsulation: ViewEncapsulation.None,

})
export class ModelsClosesComponent {
  prismCode = prismCodeData;
  modalRef1!: NgbModalRef;
  modalRef2!: NgbModalRef;
  content1: any;
  content2: any;
  longContent:any;
  content3: any;
  content4: any;
  content5: any;
  content7: any;
  content: any;
  constructor(config: NgbModalConfig, private modalService: NgbModal,) {
  }

  open(content: any) {
    this.modalService.open(content);
  }
  open1(content1: any) {
    this.modalService.open(content1);
  }
  openScrollableContent(longContent:any) {
		this.modalService.open(longContent, { scrollable: true });
	}
  openVerticallyCentered(content2:any) {
		this.modalService.open(content2, { centered: true });
	}
  VerticallyScrol(content3:any) {
		this.modalService.open(content3, {  scrollable: true,centered: true });
	}
  Tooltippopover(content4:any) {
		this.modalService.open(content4, {centered: true });
	}
  UsingGrid(content5:any) {
		this.modalService.open(content5, {centered: true });
	}
  ToggleModals(content6:any) {
    this.modalRef1=this.modalService.open(content6, {centered: true });
    if (this.modalRef2) {
      this.modalRef2.dismiss();
    }

	}
  ToggleModals2(content8:any) {
    if (this.modalRef1) {
      this.modalRef1.dismiss();
    }
    this.modalRef2=this.modalService.open(content8, {centered: true });
    
	}
  
  openXl(content7:any) {
		this.modalService.open(content7, { size: 'xl' });
	}
  openLg(content10:any) {
		this.modalService.open(content10, { size: 'lg' },);
	}
  opensm(content9:any) {
		this.modalService.open(content9, { size: 'sm' },);
    title:'large';
	}
  Fullscreen(content11: any) {
		this.modalService.open(content11, { fullscreen: true });
	}
  FullscreenSm(content12: any) {
		this.modalService.open(content12);
	}
  FullscreenMd(content13: any) {
		this.modalService.open(content13);
	}
  FullscreenLg(content14: any) {
		this.modalService.open(content14);
	}
  FullscreenXl(content15: any) {
		this.modalService.open(content15);
	}
  FullscreenXXl(content16: any) {
		this.modalService.open(content16);
	}
  openMdo(content17: any) {
		this.modalService.open(content17);
	}
  openFat(content18: any) {
		this.modalService.open(content18);
	}
  opengetbootstrap(content19: any) {
		this.modalService.open(content19);
	}
  openScale(scale: any) {
    this.modalService.open(scale, {
      centered: true,
      windowClass: 'animate__animated animate__zoomIn',
    });
  }
  
  openSlideRight(right: any) {
    this.modalService.open(right, {
      centered: true,
      windowClass: 'animate__animated animate__slideInRight',
    });
  }

  openSlideBottom(bottom: any) {
    this.modalService.open(bottom, {
      centered: true,
      windowClass: 'animate__animated animate__backInUp',
    });
  }
  openNewspaper(newspaper: any) {
    this.modalService.open(newspaper, {
      centered: true,
      windowClass: 'animate__animated animate__rotateIn',
    });
  }
  openFall(fall: any) {
    this.modalService.open(fall, {
      centered: true,
      windowClass: 'animate__animated animate__zoomIn',
    });
  }
  openFlipHorizontal(flip: any) {
    this.modalService.open(flip, {
      centered: true,
      windowClass: 'animate__animated animate__flip',
    });
  }
  openFlipVertical(modal: any) {
    this.modalService.open(modal, {
      centered: true,
      windowClass: 'animate__animated animate__flipInX',
    });
  }
  openSuperScaled(modal: any) {
    this.modalService.open(modal, {
      centered: true,
      windowClass: 'animate__animated animate__zoomIn',
    });
  }
  openSign(modal: any) {
    this.modalService.open(modal, {
      centered: true,
      windowClass: 'animate__animated animate__flipInUp',
    });
  }
  openRotateBottom(bottom: any) {
    this.modalService.open(bottom, {
      centered: true,
      windowClass: 'animate__animated animate__slideInUp',
    });
  }
  openRotateLeft(left: any) {
    this.modalService.open(left, {
      centered: true,
      windowClass: 'animate__animated animate__slideInLeft',
    });
  }
}