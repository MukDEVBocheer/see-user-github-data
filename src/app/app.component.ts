import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GitService } from './git.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'INNOVENTS_CO_GITHUB_Users';
  
  private gitService = inject(GitService);

  userNameValue: string = '';
  constUserDetailRespose: any[] = [];
  allUserRepos: any[] = []; 
  isForkSelected: boolean = false;

  onSubmitButtonCLick() {
    if (this.userNameValue !== '') {
      this.getUserDetailsByName(this.userNameValue);
    } else {
      this.constUserDetailRespose = [];
      this.allUserRepos = [];
    }
  }

  getUserDetailsByName(userName: string) {
    this.gitService.getGithubUser(userName).subscribe({
      next: (res: any) => {
        this.allUserRepos = res || []; 
        this.applyForkFilter();
      },
      error: (err: any) => {
        console.error('Error fetching user repositories:', err);
        this.constUserDetailRespose = [];
        this.allUserRepos = [];
      }
    });
  }

  onckeckBoxClicked() {
    this.applyForkFilter();
  }

  applyForkFilter() {
    if (this.allUserRepos.length === 0) {
      this.constUserDetailRespose = [];
      return;
    }
    if (this.isForkSelected) {
      this.constUserDetailRespose = this.allUserRepos.filter((item: any) => item.fork === true);
    } else {
      this.constUserDetailRespose = this.allUserRepos.filter((item: any) => item.fork === false);
    }

    this.constUserDetailRespose.sort((a, b) => b.size - a.size);
  }
}

