cellValue([[L|[[C, P]|T1]]|T], Line, Column, Value) :- (L=Line -> (C=Column -> Value=P; cellValue([[L|T1]|T], Line, Column, Value)); cellValue(T, Line, Column, Value)).
cellEmpty(Board, Line, Column) :- cellValue(Board, Line, Column, Value), Value='B'.

adjacentPieces(Line1, Column1, Line2, Column2) :- Line1 =:= Line2, Column1 =:= Column2 + 2.
adjacentPieces(Line1, Column1, Line2, Column2) :- Line1 =:= Line2, Column1 =:= Column2 - 2.
adjacentPieces(Line1, Column1, Line2, Column2) :- Line1 =:= Line2 + 1, Column1 =:= Column2 + 1.
adjacentPieces(Line1, Column1, Line2, Column2) :- Line1 =:= Line2 + 1, Column1 =:= Column2 - 1.
adjacentPieces(Line1, Column1, Line2, Column2) :- Line1 =:= Line2 - 1, Column1 =:= Column2 + 1.
adjacentPieces(Line1, Column1, Line2, Column2) :- Line1 =:= Line2 - 1, Column1 =:= Column2 - 1.

cellColor(Line, _) :- abs(Line) =:= 2.
cellColor(Line, Column) :- abs(Line) + abs(Column) =:= 4.

verifyMove(Board, Line1, Column1, [], []) :- cellEmpty(Board, Line1, Column1), \+cellColor(Line1, Column1).
verifyMove(Board, Line1, Column1, Line2, Column2) :- cellEmpty(Board, Line1, Column1), cellEmpty(Board, Line2, Column2), cellColor(Line1, Column1), Line2 =:= -Line1, Column2 =:= -Column1.
verifyMove(Board, Line1, Column1, Line2, Column2) :- cellEmpty(Board, Line1, Column1), cellEmpty(Board, Line2, Column2), \+cellColor(Line1, Column1), \+cellColor(Line2, Column2), \+adjacentPieces(Line1, Column1, Line2, Column2).

changeCell(_, _, [], []).
changeCell(Player, Column, [[H|T1]|T], NewLine) :- changeCell(Player, Column, T, AuxLine), (H=Column -> append([[Column, Player]], AuxLine, NewLine); append([[H|T1]], AuxLine, NewLine)).

implement_move(_, _, _, [], []).
implement_move(_, [], [], Board, Board).
implement_move(Player, Line, Column, [[H|T1]|T], NewBoard) :- implement_move(Player, Line, Column, T, AuxBoard), (H=Line -> changeCell(Player, Column, T1, NewLine), append([[H|NewLine]], AuxBoard, NewBoard); append([[H|T1]], AuxBoard, NewBoard)).

implement_moves([Player,Line1,Column1,Line2,Column2], Board, NewBoard) :- implement_move(Player, Line1, Column1, Board, BoardAux), implement_move(Player, Line2, Column2, BoardAux, NewBoard).

%move(+Move, +Board, -NewBoard)
%Move = [player, line1, column1, line2, column2]
move([Player,Line1,Column1,Line2,Column2], Board, NewBoard) :- verifyMove(Board, Line1, Column1, Line2, Column2), implement_moves([Player, Line1, Column1, Line2, Column2], Board, NewBoard).

calculateCellsPlayer([], _, _, []).
calculateCellsPlayer([[Column, Value]|T], Line, Player, PlayerCells) :- (Value==Player -> calculateCellsPlayer(T, Line, Player, PlayerCellsAux), append(PlayerCellsAux, [[Line, Column]], PlayerCells); calculateCellsPlayer(T, Line, Player, PlayerCells)).

calculateCellsPlayerLines([], _, []).
calculateCellsPlayerLines([[Line|Cells]|T], Player, PlayerCells):- calculateCellsPlayerLines(T, Player, PlayerCellsAux), calculateCellsPlayer(Cells, Line, Player, PlayerCellsAuxx), append(PlayerCellsAux, PlayerCellsAuxx, PlayerCells).

calculateColored([], []).
calculateColored([[Line, Column]|T], ColoredCells) :- (cellColor(Line, Column) -> calculateColored(T, ColoredCellsAux), append(ColoredCellsAux, [[Line, Column]], ColoredCells); calculateColored(T, ColoredCells)).

calculateScore([], 0).
calculateScore([[Line,Column] | T], GroupPoints):- calculateScore(T, GroupPointsAux), (cellColor(Line, Column)-> GroupPoints is GroupPointsAux+1; GroupPoints is GroupPointsAux, !).

calculateGroupsScore([], []).
calculateGroupsScore([Group|T], Points):- calculateGroupsScore(T, PointsAux), calculateScore(Group, PointsGroup), append(PointsAux, [PointsGroup], Points).

calculatePoints(Board, Player, Points) :- 
        calculateCellsPlayerLines(Board, Player, PlayerCells), 
        calculateColored(PlayerCells, ColoredCells), 
        calculateGroups(PlayerCells, ColoredCells, [], FinalGroups, [], _),
        calculateGroupsScore(FinalGroups, Points).

%calculateGroup(+PlayerCells, +PlayerCellsToIterate, +StartingCell, +InitialGroup, -FinalGroup, +InitialUsedCells, -FinalUsedCells)
calculateGroup(_, [], _, InitialGroup, InitialGroup, InitialUsedCells, InitialUsedCells).
calculateGroup(PlayerCells, [[Line, Column]|T], [ColoredLine, ColoredColumn], Igroup, Fgroup, IusedCells, FusedCells) :- 
                                    (adjacentPieces(Line, Column, ColoredLine, ColoredColumn), \+ member([Line, Column], IusedCells) -> 
                                        append(IusedCells, [[Line, Column]], UsedCells1), 
                                        append(Igroup, [[Line, Column]], Group1), 
                                        calculateGroup(PlayerCells, T, [ColoredLine, ColoredColumn], Group1, Group2, UsedCells1, UsedCells2), 
                                        calculateGroup(PlayerCells, PlayerCells, [Line, Column], Group2, Fgroup, UsedCells2, FusedCells); 
                                        calculateGroup(PlayerCells, T, [ColoredLine, ColoredColumn], Igroup, Fgroup, IusedCells, FusedCells)).

%calculateGroups(+PlayerCells, +ColoredCells, +InitialGroups, -FinalGroups, +InitialUsedCells, -FinalUsedCells)
calculateGroups(_, [], InitialGroups, InitialGroups, InitialUsedCells, InitialUsedCells).
calculateGroups(PlayerCells, [[Line, Column]|T], Igroups, Fgroups, IusedCells, FusedCells) :- 
                            (member([Line,Column], IusedCells) ->
                                calculateGroups(PlayerCells, T, Igroups, Fgroups, IusedCells, FusedCells);
                                append(IusedCells, [[Line, Column]], UsedCells1),
                                calculateGroup(PlayerCells, PlayerCells, [Line, Column], [[Line, Column]], Group1, UsedCells1, UsedCells2),
                                append(Igroups, [Group1], Group2),
                                calculateGroups(PlayerCells, T, Group2, Fgroups, UsedCells2, FusedCells)).

lineFull([]).
lineFull([[_,Value] | T]) :- Value \= 'B', lineFull(T). 

boardFull([]).
boardFull([[_|TLine]|T]):- lineFull(TLine), boardFull(T).

deleteElement([], _, InitialList, InitialList).
deleteElement([Elem | T], Element, InitialList, NewList):- ( Element \= Elem -> append(InitialList, Elem, AuxList), deleteElement(T, Element, AuxList, NewList); append(InitialList, T, NewList)).

maxlist([],0).

maxlist([Head|Tail],Max) :-
    maxlist(Tail,TailMax),
    Head > TailMax,
    Max is Head.

maxlist([Head|Tail],Max) :-
    maxlist(Tail,TailMax),
    Head =< TailMax,
    Max is TailMax.


calculateWinner([], [], 3).
calculateWinner([], _, 1).
calculateWinner(_, [], 2).
calculateWinner(PointsP1, PointsP2, Winner):-  maxlist(PointsP1, MaxP1), maxlist(PointsP2, MaxP2),
                        (MaxP1 == MaxP2 -> 
                            deleteElement(PointsP1, MaxP1, [], NewPointsP1), 
                            deleteElement(PointsP2, MaxP2, [], NewPointsP2), 
                            calculateWinner(NewPointsP1,NewPointsP2, Winner); 
                            (MaxP2 > MaxP1 -> Winner = 2; Winner = 1)).

game_over_sure(Board, Winner) :- calculatePoints(Board,1,PointsP1), calculatePoints(Board,2,PointsP2), calculateWinner(PointsP1, PointsP2, Winner).

%game_over(+Board, -Winner)
game_over(Board, Winner) :- (boardFull(Board) ->  
calculatePoints(Board,1,PointsP1), calculatePoints(Board,2,PointsP2), calculateWinner(PointsP1, PointsP2, Winner); Winner = 0) .