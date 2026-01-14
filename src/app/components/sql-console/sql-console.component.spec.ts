import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SqlConsoleComponent } from './sql-console.component';

describe('SqlConsoleComponent', () => {
  let component: SqlConsoleComponent;
  let fixture: ComponentFixture<SqlConsoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SqlConsoleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SqlConsoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
