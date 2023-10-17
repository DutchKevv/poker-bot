import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageRoomsComponent } from './pages/page-rooms/page-rooms.component';

const routes: Routes = [
  {
    path:'',
    component: PageRoomsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
