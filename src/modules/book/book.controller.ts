import { Controller, Get, Param, ParseIntPipe, Post, UseGuards, Body, Patch, Delete } from '@nestjs/common';
import { BookService } from './book.service';
import { ReadBookDto } from './dto/read-book.dto';
import { Roles } from '../role/decorators/role.decorator';
import { RoleType } from '../role/roletype.enum';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../role/guards/role.guard';
import { CreateBookDto, UpdateBookDto } from './dto';
import { GetUser } from '../auth/user.decorator';

@Controller('book')
export class BookController {
    constructor(private readonly _bookService: BookService){}

    @Get(':bookId')
    getRole(@Param('bookId', ParseIntPipe) bookId: number): Promise<ReadBookDto>{
        return this._bookService.get(bookId);
    }

    @Get()
    async getBooks(): Promise<ReadBookDto[]>{
        return this._bookService.getAll();
    }

    @Get('author/:authorId')
    async getBooksByAuthor(@Param('authorId', ParseIntPipe) authorId: number): Promise<ReadBookDto[]>{
        return this._bookService.getBooksByAuthor(authorId);
    }

    @Post('create')
    @Roles(RoleType.AUTHOR)
    @UseGuards(AuthGuard(), RoleGuard)
    async createRole(@Body() book: Partial<CreateBookDto>): Promise<ReadBookDto>{
        return this._bookService.create(book);
    }

    @Patch(':bookId')
    async updateRole(
        @Param('bookId', ParseIntPipe) bookId: number, 
        @Body() book: Partial<UpdateBookDto>,
        @GetUser('id') authorId: number){
        return this._bookService.update(bookId, book, authorId);
    }

    @Delete(':bookId')
    async deleteRole(@Param('bookId', ParseIntPipe) bookId: number){
        return this._bookService.delete(bookId);
    }

}
