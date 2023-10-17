import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RoomComponent } from './components/room/room.component';
import { HttpClientModule } from '@angular/common/http';
import { CardComponent } from './components/card/card.component';
import { RoomControlsComponent } from './components/room/room-controls/room-controls.component';
import { RoomLogsComponent } from './components/room/room-logs/room-logs.component';
import { RoomTableComponent } from './components/room/room-table/room-table.component';
import { PageRoomsComponent } from './pages/page-rooms/page-rooms.component';

@NgModule({
  declarations: [
    AppComponent,
    RoomComponent,
    CardComponent,
    PageRoomsComponent,
    RoomControlsComponent,
    RoomLogsComponent,
    RoomTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
