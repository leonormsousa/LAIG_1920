game(Board, Player1, Player2, Difficulty, PassNumber) :-
    (PassNumber >= 2 -> game_over_sure(Board, Winner), writeWinner(Winner), break;
    (Player1 = 'C2' -> choose_move(Board, Difficulty, 2, MoveAux), append([2], MoveAux, Move),
        (move(Move, Board, NewBoard) ->
            displayBoard(NewBoard),
            game_over(NewBoard, Winner), (Winner \= 0 ->                     
            writeWinner(Winner), break;
            game(NewBoard, Player2, Player1, Difficulty, 0)); 
            writeError, displayBoard(Board), game(Board, Player1, Player2, Difficulty, 0));
            %MoveAux = [Line1, Column1, Line2, Column2]
            (Player1 = 'C1' -> choose_move(Board, Difficulty, 1, MoveAux), append([1], MoveAux, Move), 
                 (move(Move, Board, NewBoard) ->
                    displayBoard(NewBoard),
                    game_over(NewBoard, Winner), (Winner \= 0 ->                     
                    writeWinner(Winner), break;
                    game(NewBoard, Player2, Player1, Difficulty, 0)); 
                    writeError, displayBoard(Board), game(Board, Player1, Player2, Difficulty, 0));
                write('\n--> P'), write(Player1), write(': Choose a Line for Piece1 '), read(Line1),
                ( \+ number(Line1)  ->  Pass is PassNumber + 1, game(Board, Player2, Player1, Difficulty, Pass), fail; !),
                (abs(Line1) > 7 -> writeError('Piece1 out of bounds'), game(Board, Player1, Player2, Difficulty, 0), fail; !),
                write('--> P'), write(Player1), write(': Choose a Column for Piece1 '), read(Column1), 
                (abs(Line1) + abs(Column1) > 14 -> writeError('Piece1 out of bounds'), game(Board, Player1, Player2, Difficulty, 0), fail; !),
                ((abs(Line1) + abs(Column1)) mod 2 =:= 1 -> writeError('Piece1 doesnt exist'), game(Board, Player1, Player2, Difficulty, 0), fail;!),
                write('--> P'), write(Player1), write(': Choose a Line for Piece2 '), read(Line2),
                (\+ number(Line2) -> 
                    (move([Player1, Line1, Column1, [], []], Board, NewBoard) ->
                        displayBoard(NewBoard),
                        game_over(NewBoard, Winner), (Winner \= 0 -> writeWinner(Winner), break;
                        game(NewBoard, Player2, Player1, Difficulty, 0));
                        writeError, displayBoard(Board), game(Board, Player1, Player2, Difficulty, 0));
                (abs(Line2) > 7 -> writeError('Piece2 out of bounds'), game(Board, Player1, Player2, Difficulty, 0), fail;!),
                write('--> P'), write(Player1), write(': Choose a Column for Piece2 '), read(Column2),
                (abs(Line2) + abs(Column2) > 14 -> writeError('Piece2 out of bounds'), game(Board, Player1, Player2, Difficulty, 0), fail;!),
                ((abs(Line2) + abs(Column2)) mod 2 =:= 1 -> writeError('Piece2 doesnt exit'), game(Board, Player1, Player2, Difficulty, 0), fail; !),
                (Line1 =:= Line2, Column1 =:= Column2 -> writeError('Pieces are the same'), game(Board, Player1, Player2, Difficulty, 0), fail; !)),
                (move([Player1, Line1, Column1, Line2, Column2], Board, NewBoard) ->
                    displayBoard(NewBoard),
                    game_over(NewBoard, Winner), (Winner \= 0 ->                     
                    writeWinner(Winner), break;
                    game(NewBoard, Player2, Player1, Difficulty, 0)); 
                    writeError, displayBoard(Board), game(Board, Player1, Player2, Difficulty, 0))))).

firstPlay(Board, Player1, Player2, Difficulty) :- displayBoard(Board), 
   (Player1 = 'C1' -> generateIsolatedMove(Board, Board, ValidMoves), calculateBestMove(ValidMoves, MoveAux), append([1], MoveAux, Move), 
        (move(Move, Board, NewBoard) ->
            displayBoard(NewBoard),
            game(NewBoard, Player2, Player1, Difficulty, 0); 
            writeError, displayBoard(Board), game(Board, Player1, Player2, Difficulty, 0));
        write('\n--> P1: Choose a Line'), read(Line1),
        (abs(Line1) > 7 -> writeError('Piece1 out of bounds'), firstPlay(Board, Player1, Player2, Difficulty), fail;
            write('--> P1: Choose a Column'), read(Column1), 
            (abs(Line1) + abs(Column1) > 14 -> writeError('Piece1 out of bounds'), firstPlay(Board, Player1, Player2, Difficulty), fail;
                ((abs(Line1) + abs(Column1)) mod 2 =:= 1 -> writeError('Piece1 doesnt exist'), firstPlay(Board, Player1, Player2, Difficulty), fail;
                    (move([1, Line1, Column1, [], []], Board, NewBoard) -> 
                        displayBoard(NewBoard), 
                        game(NewBoard, Player2, Player1, Difficulty, 0);
                        writeError, displayBoard(Board), firstPlay(Board, Player1, Player2, Difficulty)))))).


startGame(Board) :- displayBoard(Board), ( \+ firstPlay(Board, 1,2,0) -> write('Game is over');!) .

parseDifficulty(Difficulty, Board, 'C1'):- firstPlay(Board, 'C1', 'C2', Difficulty).
parseDifficulty(Difficulty, Board, 1) :- firstPlay(Board, 1, 'C2', Difficulty).

parseInput(1, Board) :- startGame(Board).
parseInput(2, Board) :- displayDifficulty,  write('--> Insert your option: '), read(Input), \+parseDifficulty(Input, Board, 1). 
parseInput(3, Board) :- displayDifficulty,  write('--> Insert your option: '), read(Input), \+parseDifficulty(Input, Board, 'C1'). 

play :- board(Board), displayMenu, write('--> Insert your option: '), read(Input), \+parseInput(Input, Board).