% Move tem o format
% Move[player, line1, column1, line2, column2]

calculateCellWeight([], [], 0).
calculateCellWeight(Line, Column, Weight):- Weight is 2*abs(Line)+abs(Column).

generateMovesFromLine(_, [], _, _, _, _, []).
generateMovesFromLine(Board, [[CellBoard | _] | T],[Cell | Value], LineBoard, Line, Player, ValidMoves) :- generateMovesFromLine(Board, T, [Cell, Value], LineBoard, Line, Player, ValidMovesAux), (verifyMove(Board, Line, Cell, LineBoard, CellBoard), (Line =:= LineBoard, Cell =:=CellBoard -> fail;!) -> append(ValidMovesAux, [ [Line,Cell, LineBoard,  CellBoard] ], ValidMoves); ValidMoves = ValidMovesAux, !).

generateValidMovesCell(_, [], _, _, _, []).
generateValidMovesCell(Board, Board, [Cell, _], Line, _, ValidMoves):- cellColor(Line, Cell), cellEmpty(Board, Line, Cell), Line2 is -Line, Column2 is -Cell, ValidMoves = [[Line, Cell, Line2, Column2]].
generateValidMovesCell(Board, [[LineBoard | Cells ] | T], [Cell, Value], Line, Player, ValidMoves):- generateValidMovesCell(Board, T, [Cell, Value], Line, Player, ValidMovesAux), generateMovesFromLine(Board, Cells, [Cell, Value], LineBoard, Line, Player, ValidFromLine), append(ValidMovesAux, ValidFromLine, ValidMoves).

generateValidMovesLine(_, _, [], _, []).
generateValidMovesLine(Board, Line, [ Cell | T], Player, ValidMoves):- generateValidMovesLine(Board, Line, T, Player, ValidMovesAux), generateValidMovesCell(Board, Board, Cell, Line, Player, ValidInCell), append(ValidMovesAux, ValidInCell, ValidMoves).

generateValidMoves(_, [], _, []).
generateValidMoves(Board, [[Line| Cells] | T ], Player, ValidMoves):- generateValidMoves(Board, T, Player, ValidMovesAux), generateValidMovesLine(Board, Line, Cells, Player, ValidInLine), append(ValidMovesAux, ValidInLine, ValidMoves).

%valid_moves(+Board, +Player, -ListOfMoves)

calculateMoveScore([], 0).
calculateMoveScore([Line1, Column1, Line2, Column2], Score) :- calculateCellWeight(Line1, Column1, Weight1), calculateCellWeight(Line2, Column2, Weight2), Score is Weight1+Weight2.

calculateBestMove([], []).
calculateBestMove([Move | T], BestMove) :- calculateBestMove(T, BestMoveAux), calculateMoveScore(Move, Score), calculateMoveScore(BestMoveAux, Score2), (Score >= Score2 -> BestMove = Move; BestMove= BestMoveAux).  

checkCellForIsolatedMove(_, _, [], []).
checkCellForIsolatedMove(Board, Line, [Cell | _], Move):- (cellEmpty(Board,Line, Cell), \+cellColor(Line, Cell) -> Move = [[Line, Cell, [], []]]; Move = []).

checkLineForIsolatedMove(_, [], _, []).
checkLineForIsolatedMove(Board, [Cell | T], Line, Moves):- checkLineForIsolatedMove(Board, T, Line, MovesAux), checkCellForIsolatedMove(Board, Line, Cell, CellMove), append(MovesAux, CellMove, Moves).

generateIsolatedMove(_, [], []).
generateIsolatedMove(Board, [[Line | Cells] | T], Moves):- generateIsolatedMove(Board, T, MovesAux), checkLineForIsolatedMove(Board, Cells, Line, LineMoves), append(MovesAux, LineMoves, Moves).

valid_moves(Board, Player, ValidMoves) :- generateValidMoves(Board, Board, Player, ValidMoves1), generateIsolatedMove(Board, Board, ValidMoves2), append(ValidMoves1, ValidMoves2, ValidMoves).

applyEveryMove(_, [], _, []).
applyEveryMove(Board, [Move|Moves], Player, Boards) :- applyEveryMove(Board, Moves, Player, BoardsAux), append([Player], Move, MoveComplete),  (move(MoveComplete, Board, NewBoard1) -> append(BoardsAux, [NewBoard1], Boards); Boards = BoardsAux).

calculateBoardsWeight([], _, []).
calculateBoardsWeight([Board|Boards], Player, Weights) :- calculateBoardsWeight(Boards, Player, Weight), value(Board, Player, Value), append(Weight, [Value], Weights).

calculateBestBoard([],_,[],Weight):- Weight=0.
calculateBestBoard([Board | Boards], Player, FinalBoard, FinalWeight):- calculateBestBoard(Boards, Player, FinalBoardAux, FinalWeightAux),
                            value(Board, Player, Weight), (Weight>=FinalWeightAux -> FinalBoard = Board, FinalWeight= Weight; FinalBoard=FinalBoardAux, FinalWeight= FinalWeightAux).

calculateBestBoard([],_,[],Weight,[]):- Weight=0.
calculateBestBoard([Board | Boards], Player, [Move | Moves], FinalWeight, FinalMove):- calculateBestBoard(Boards, Player, Moves, WeightAux, FinalMoveAux),
                        value(Board, Player, Weight), (Weight >= WeightAux -> FinalMove = Move, FinalWeight= Weight; FinalWeight=WeightAux, FinalMove = FinalMoveAux). 


generateBoards([],_,[]).
generateBoards([Board | Boards], Player, AllBoards):- generateBoards(Boards, Player, AllBoardsAux), 
            valid_moves(Board, Player, ValidMoves), applyEveryMove(Board, ValidMoves, Player, NewBoards1), 
            calculateBestBoard(NewBoards1, Player, NewBoard, NewWeight), 
            append(AllBoardsAux, NewBoard, AllBoards).

generateAllBoards([],_,_,[]).
generateAllBoards(Boards, NumberPlays, Player, BestBoards):- generateBoards(Boards, Player, AllBoards),
                                            NumberPlaysNew is NumberPlays-1, (Player==1 -> Player1 is 2; Player1 is 1), 
                                            (NumberPlaysNew > 0 -> 
                                                generateAllBoards(AllBoards, NumberPlaysNew, Player1, BestBoards); 
                                                append(AllBoards, [], BestBoards)).

chooseBestBoard(Board, NumberPlays, Player, BestMove):- valid_moves(Board, Player, ValidMoves), 
                    applyEveryMove(Board, ValidMoves, Player, NewBoards1), 
                    NumberPlaysNew is NumberPlays-1, (Player==1 -> Player1 is 2; Player1 is 1),
                    (NumberPlaysNew > 0 -> generateAllBoards(NewBoards1, NumberPlaysNew, Player1,BestBoards);
                        BestBoards = NewBoards1) ,
                    calculateBestBoard(BestBoards, Player, ValidMoves, BestWeight, BestMove).


%choose_move(+Board, +Level, +Player, -Move)
choose_move(Board, 1, Player, Move):- chooseBestBoard(Board, 1, Player, Move), write(Move).
choose_move(Board, 2, Player, Move):- chooseBestBoard(Board, 3, Player, Move).
choose_move(Board, 3, Player, Move):- chooseBestBoard(Board, 5, Player, Move).

calculateCellsWeight([], 0).
calculateCellsWeight([[Line, Column] | T], Weight) :- calculateCellsWeight(T, WeightAux), calculateCellWeight(Line, Column, WeightCell), Weight is WeightAux + WeightCell.

%value(Board, Player, Value)
value(Board, Player, Value) :- calculateCellsPlayerLines(Board, Player, PlayerCells), calculateCellsWeight(PlayerCells, Value).