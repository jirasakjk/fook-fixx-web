import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserSummary {
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly http = inject(HttpClient);

  getUser(userId: number): Observable<UserSummary> {
    return this.http.get<UserSummary>(`https://jsonplaceholder.typicode.com/users/${userId}`);
  }
}
