import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  displayedColumns: string[] = ['select', 'username', 'email', 'role'];
  dataSource = new MatTableDataSource<any>();
  selectedRole: string | null = null;
  selection = new SelectionModel<any>(true, []);
  errorMessage: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.http.get<any[]>('http://127.0.0.1:5000/users').subscribe(
      (users) => {
        this.dataSource.data = users;
      },
      (error) => {
        console.error('Error fetching users: ', error);
      }
    );
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  assignSelectedRole(): void {
    if (this.selectedRole && this.selection.selected.length > 0) {
      const selectedUsernames = this.selection.selected.map(user => user.username);
      this.http.post<any>('http://127.0.0.1:5000/add_role', { username: selectedUsernames[0], role: this.selectedRole }).subscribe(
        (response) => {
          this.errorMessage = response.msg
          // Clear the selection
          this.selection.clear();
          // Refresh the user data after assigning roles
          this.fetchUsers();
        },
        (error) => {
          this.errorMessage = 'Error assigning role: ';
        }
      );
    } else {
      this.errorMessage = 'No role selected or no users selected'
    }
  }  
}
