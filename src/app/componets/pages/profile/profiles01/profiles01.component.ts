import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../../shared/common/sharedmodule';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProfileService } from '../../../../shared/services/profile.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profiles01',
  standalone: true,
  imports: [SharedModule,RouterModule,NgbModule,CommonModule],
  templateUrl: './profiles01.component.html',
  styleUrls: ['./profiles01.component.scss']
})
export class Profiles01Component implements OnInit {
  profileData: any;
  isLoading = true;

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    this.loadProfileData();
  }

  loadProfileData(): void {
    this.profileService.getProfileData().subscribe(
      (data) => {
        this.profileData = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading profile data', error);
        this.isLoading = false;
      }
    );
  }

}
