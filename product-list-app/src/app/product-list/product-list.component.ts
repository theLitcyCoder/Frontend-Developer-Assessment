import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

interface Product {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  stock: string;
  price: number;
}

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  displayedColumns: string[] = ['id', 'title', 'description']; // Add more column names as needed
  displayedProducts: Product[] = [];
  sortedData: Product[] = [];
  totalItems: number = 0;
  currentPage = 1;
  pageSize = 5;

  constructor(private http: HttpClient) {
    this.sortedData = this.products.slice();
  }

  ngOnInit(): void {
    this.http.get<any>('https://dummyjson.com/products').subscribe(
      (response) => {
        this.products = response.products;
        this.totalItems = this.products.length;
        this.sortedData = this.products.slice();
        this.updateDisplayedProducts();
        console.log(response.products);
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  // sort the cards based on sorting categories
  sortData(sort: Sort) {
    const data = this.products.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'title':
          return compare(a.title, b.title, isAsc);
        case 'category':
          return compare(a.category, b.category, isAsc);
        case 'stock':
          return compare(a.stock, b.stock, isAsc);
        case 'price':
          return compare(a.price, b.price, isAsc);
        default:
          return 0;
      }
    });
    this.updateDisplayedProducts();
  }

  // updates the information on the cards when displayed
  updateDisplayedProducts(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.displayedProducts = this.sortedData.slice(
      startIndex,
      startIndex + this.pageSize
    );
  }

  // displays the next set of cards based on number of items to be shown
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.updateDisplayedProducts();
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
