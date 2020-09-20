import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookRepository } from './book.repository';
import { UserRepository } from '../user/user.repository';
import { ReadBookDto } from './dto/read-book.dto';
import { plainToClass } from 'class-transformer';
import { Book } from './book.entity';
import { In } from 'typeorm';
import { Role } from '../role/role.entity';
import { RoleType } from '../role/roletype.enum';
import { CreateBookDto } from './dto';
import { User } from '../user/user.entity';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
    constructor( 
        @InjectRepository(BookRepository)
        private readonly _bookRepository: BookRepository,
        @InjectRepository(UserRepository)
        private readonly _userRepository: UserRepository){}

    async get(bookId:number): Promise<ReadBookDto>{
        if(!bookId)
            throw new BadRequestException('bookId must be sent');
        const book: Book = await this._bookRepository.findOne(
            bookId, { where: { status: 'ACTIVE' }});
        if(!book)
            throw new NotFoundException('book does not exists')
        return plainToClass(ReadBookDto, book);
    }

    async getAll(): Promise<ReadBookDto[]>{        
        const books: Book[] = await this._bookRepository.find( 
            {where: {status: 'ACTIVE'}
        });
        if(!books)
            throw new NotFoundException();
        return books.map((book: Book) => plainToClass(ReadBookDto, book));
    }

    async getBooksByAuthor(authorId: number): Promise<ReadBookDto[]>{
        if(!authorId)
            throw new BadRequestException('authorId must be sent');
            const books: Book[] = await this._bookRepository.find( 
                {where: {status: 'ACTIVE', authors: In([authorId]) }
            });
            if(!books)
                throw new NotFoundException();
            return books.map((book: Book) => plainToClass(ReadBookDto, book));
    }

    async create(book: Partial<CreateBookDto>): Promise<ReadBookDto>{
        const authors: User[] = [];
        
        for(const authorId of book.authors){
            const authorExists = await this._userRepository.findOne(
                authorId, { where: { status: 'ACTIVE' } });
            
            if(!authorExists)
                throw new NotFoundException(`There's not an author witch this Id: ${authorId}`);
            
            const isAuthor = authorExists.roles.some(
                (role: Role) => role.name === RoleType.AUTHOR,
            );
    
            if(!isAuthor)
                throw new UnauthorizedException(`This user ${authorId} is not an author`)
    
            authors.push(authorExists);
        }
        
        const saveBok: Book = await this._bookRepository.save({
            name: book.name,
            description: book.description,
            authors
        });

        return plainToClass(ReadBookDto, saveBok);
    }

    async createByAuthor(book: Partial<CreateBookDto>, authorId: number){
        const author = await this._userRepository.findOne(
            authorId, { where: { status: 'ACTIVE' } });

        const isAuthor = author.roles.some(
            (role: Role) => role.name === RoleType.AUTHOR);
    
        if(!isAuthor)
            throw new UnauthorizedException(`This user ${authorId} is not an author`);

        const saveBok: Book = await this._bookRepository.save({
            name: book.name,
            description: book.description,
            author
        });

        return plainToClass(ReadBookDto, saveBok);
    }

    async update(
        bookId: number, 
        book: Partial<UpdateBookDto>, 
        authorId: number): Promise<UpdateBookDto>{

        const bookExists = await this._bookRepository.findOne(
            bookId, { where: { status: 'ACTIVE' } });
        
        if(!bookExists)
            throw new NotFoundException('This book does not exists');

        const isOwnBook = bookExists.authors.some( author => author.id === authorId);

        if(!isOwnBook)
            throw new UnauthorizedException(`This user isn't the book's author`);

        const updateBook = await this._bookRepository.update(bookId, book);
        return plainToClass(ReadBookDto, updateBook);
    }

    async delete(bookId: number):Promise<void>{

        const bookExists = await this._bookRepository.findOne(
            bookId, { where: { status: 'ACTIVE' } });
        
        if(!bookExists)
            throw new NotFoundException('This book does not exists');

        await this._bookRepository.update (bookId, { status: 'INACTIVE' });
    }


}
