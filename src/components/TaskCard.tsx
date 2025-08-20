import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Task, TaskStatus, TaskPriority } from '@/types/task';
import { Calendar, Clock, MoreHorizontal, Trash2, Edit } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: number, status: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

const statusColors: Record<TaskStatus, string> = {
  'a fazer': 'bg-todo/10 text-todo border-todo/20',
  'em andamento': 'bg-doing/10 text-doing border-doing/20',
  'concluído': 'bg-done/10 text-done border-done/20',
};

const priorityColors: Record<TaskPriority, string> = {
  baixa: 'bg-priority-low/10 text-priority-low border-priority-low/20',
  média: 'bg-priority-medium/10 text-priority-medium border-priority-medium/20',
  alta: 'bg-priority-high/10 text-priority-high border-priority-high/20',
};

const priorityDots: Record<TaskPriority, string> = {
  baixa: 'bg-priority-low',
  média: 'bg-priority-medium',
  alta: 'bg-priority-high',
};

const statusLabels: Record<TaskStatus, string> = {
  'a fazer': 'A Fazer',
  'em andamento': 'Em Andamento',
  'concluído': 'Concluído',
};

const priorityLabels: Record<TaskPriority, string> = {
  baixa: 'Baixa',
  média: 'Média',
  alta: 'Alta',
};

export const TaskCard = ({ task, onStatusChange, onEdit, onDelete }: TaskCardProps) => {
  const dueDate = task.dueDate ? parseISO(task.dueDate) : undefined;
  const createdAt = parseISO(task.createdAt);
  const isOverdue = dueDate && dueDate < new Date() && task.status !== 'concluído';

  return (
    <Card className={cn(
      "group hover:shadow-md transition-all duration-200 border-border/50",
      task.status === 'concluído' && "opacity-75",
      isOverdue && "border-destructive/30"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
          <Checkbox
            checked={task.status === 'concluído'}
            onCheckedChange={(checked) => {
              console.log("Checkbox toggled:", checked);
              const newStatus = checked ? 'concluído' : 'a fazer';
              onStatusChange(task.id, newStatus);
            }}
          />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className={cn("w-2 h-2 rounded-full flex-shrink-0", priorityDots[task.priority])} />
                <h3 className={cn(
                  "font-semibold text-sm leading-tight",
                  task.status === 'concluído' && "line-through text-muted-foreground"
                )}>
                  {task.title}
                </h3>
              </div>
              {task.description && (
                <p className={cn(
                  "text-sm text-muted-foreground line-clamp-2",
                  task.status === 'concluído' && "line-through"
                )}>
                  {task.description}
                </p>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(task.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={statusColors[task.status]}>
              {statusLabels[task.status]}
            </Badge>
            <Badge variant="outline" className={priorityColors[task.priority]}>
              {priorityLabels[task.priority]}
            </Badge>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {dueDate && (
              <div className={cn(
                "flex items-center gap-1",
                isOverdue && "text-destructive font-medium"
              )}>
                <Calendar className="h-3 w-3" />
                {format(dueDate, 'dd MMM', { locale: ptBR })}
              </div>
            )}

          </div>
        </div>
      </CardContent>
    </Card>
  );
};
