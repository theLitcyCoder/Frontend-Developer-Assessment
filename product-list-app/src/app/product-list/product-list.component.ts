import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ThemePalette } from '@angular/material/core';

interface Product {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  stock: string;
  price: number;
}

interface ChipColor {
  name: string;
  color: ThemePalette;
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
  filteredProducts: Product[] = [];
  totalItems: number = 0;
  currentPage = 1;
  pageSize = 8;
  selectedChip!: string;
  value = '';

  constructor(private http: HttpClient) {
    this.sortedData = this.products.slice();
  }

  ngOnInit(): void {
    this.http.get<any>('https://dummyjson.com/products').subscribe(
      (response) => {
        this.products = response.products;
        this.totalItems = this.products.length;
        this.sortedData = this.products.slice();
        this.searchProducts();
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
      // this.selectedChip = '';
      return;
    }

    this.selectedChip = sort.active;

    // this.sortedData = data.sort((a, b) => {
    //   const isAsc = sort.direction === 'asc';
    //   return compare((a as any)[sort.active], (b as any)[sort.active], isAsc);
    // });

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

  // search for a product
  searchProducts(): void {
    const query = this.value.toLowerCase().trim();

    if (query === '') {
      this.filteredProducts = this.products.slice();
    } else {
      this.filteredProducts = this.products.filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      );
    }

    this.totalItems = this.filteredProducts.length;
    this.sortedData = this.filteredProducts.slice();
    this.updateDisplayedProducts();
  }

  // updates the information on the cards when displayed
  updateDisplayedProducts(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const sortedData = this.sortedData.slice(); // Make a copy of the sortedData array

    const sortedAndFilteredData = sortedData.filter((product) => {
      // Apply your filtering logic here, e.g., check if the product matches the search criteria
      return product.title.toLowerCase().includes(this.value.toLowerCase());
    });

    this.displayedProducts = sortedAndFilteredData.slice();

    // Perform sorting on the displayedProducts array
    this.displayedProducts.sort((a, b) => {
      const isAsc = this.selectedChip === 'title' ? true : false;
      return compare(
        (a as any)[this.selectedChip],
        (b as any)[this.selectedChip],
        isAsc
      );
    });

    // Update the totalItems based on the filtered and sorted data
    this.totalItems = this.displayedProducts.length;

    // Slice the displayedProducts array based on the current page and page size
    this.displayedProducts = this.displayedProducts.slice(
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

  selectChip(chip: string) {
    this.selectedChip = chip;
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
