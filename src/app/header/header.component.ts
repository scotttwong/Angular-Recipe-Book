import { Component, Output, EventEmitter } from '@angular/core';
import { DataStorageService } from '../shared/datastorage.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})

export class HeaderComponent {
    // @Output() clickedPage: EventEmitter<string> = new EventEmitter();
    collapsed = true;

    // viewPage(pageName: string) {
    //     this.clickedPage.emit(pageName);
    // }

    constructor(private dataStorageService: DataStorageService) {}

    onUpdateData() {
        this.dataStorageService.updateRecipes().subscribe(
            (response) => {
                console.log(response);
            }
        );
    }

    onFetchData() {
        this.dataStorageService.getRecipes().subscribe();
    }
}
