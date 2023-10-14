import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LobbyComponent } from './pages/lobby/lobby.component';

const routes: Routes = [
  // {path: '', component: LobbyComponent},
  {path: '', loadChildren: () => import('./components/room/room.module').then(mod => mod.RoomModule) },
  // {path: 'room/:id', loadChildren: () => import('./components/room/room.module').then(mod => mod.RoomModule) },
  {path: 'room/:id/:round', loadChildren: () => import('./components/room/room.module').then(mod => mod.RoomModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
