import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  messages?: Message[];
}

interface Message {
  id: number;
  text: string;
  time: string;
  sender: 'me' | 'other';
  type?: 'text' | 'voice' | 'video';
}

const mockChats: Chat[] = [
  { 
    id: 1, 
    name: 'Анна Смирнова', 
    avatar: '👩', 
    lastMessage: 'Привет! Как дела?', 
    time: '14:32', 
    unread: 3, 
    online: true,
    messages: [
      { id: 1, text: 'Привет! Как дела?', time: '14:32', sender: 'other' },
      { id: 2, text: 'Отлично, спасибо! А у тебя?', time: '14:30', sender: 'me' },
      { id: 3, text: 'Давно не виделись!', time: '14:28', sender: 'other' },
    ]
  },
  { id: 2, name: 'Команда разработки', avatar: '💻', lastMessage: 'Готово к релизу', time: '13:15', unread: 0, online: false },
  { id: 3, name: 'Максим Иванов', avatar: '👨', lastMessage: 'Отправил файлы', time: '12:04', unread: 1, online: true },
  { id: 4, name: 'Семья', avatar: '👨‍👩‍👧‍👦', lastMessage: 'Встречаемся в 18:00', time: 'Вчера', unread: 0, online: false },
  { id: 5, name: 'Ольга Петрова', avatar: '👩‍💼', lastMessage: 'Спасибо за помощь!', time: 'Вчера', unread: 0, online: true },
];

const mockContacts = [
  { id: 1, name: 'Анна Смирнова', avatar: '👩', status: 'В сети', online: true },
  { id: 2, name: 'Максим Иванов', avatar: '👨', status: 'Был недавно', online: true },
  { id: 3, name: 'Ольга Петрова', avatar: '👩‍💼', status: 'В сети', online: true },
  { id: 4, name: 'Дмитрий Козлов', avatar: '👨‍💻', status: 'Не в сети', online: false },
  { id: 5, name: 'Елена Волкова', avatar: '👩‍🎓', status: 'Не в сети', online: false },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState('chats');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messageText, setMessageText] = useState('');
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedChat) return;

    const now = new Date();
    const timeString = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newMessage: Message = {
      id: (selectedChat.messages?.length || 0) + 1,
      text: messageText,
      time: timeString,
      sender: 'me'
    };

    const updatedChats = chats.map(chat => {
      if (chat.id === selectedChat.id) {
        return {
          ...chat,
          messages: [...(chat.messages || []), newMessage],
          lastMessage: messageText,
          time: timeString
        };
      }
      return chat;
    });

    setChats(updatedChats);
    const updatedChat = updatedChats.find(c => c.id === selectedChat.id);
    if (updatedChat) setSelectedChat(updatedChat);
    setMessageText('');
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingDuration(0);
    const interval = setInterval(() => {
      setRecordingDuration(prev => prev + 1);
    }, 1000);
    (window as any).recordingInterval = interval;
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if ((window as any).recordingInterval) {
      clearInterval((window as any).recordingInterval);
    }
    
    if (recordingDuration >= 1 && selectedChat) {
      const now = new Date();
      const timeString = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      const newMessage: Message = {
        id: (selectedChat.messages?.length || 0) + 1,
        text: `🎤 Голосовое сообщение (${recordingDuration} сек)`,
        time: timeString,
        sender: 'me',
        type: 'voice'
      };

      const updatedChats = chats.map(chat => {
        if (chat.id === selectedChat.id) {
          return {
            ...chat,
            messages: [...(chat.messages || []), newMessage],
            lastMessage: '🎤 Голосовое сообщение',
            time: timeString
          };
        }
        return chat;
      });

      setChats(updatedChats);
      const updatedChat = updatedChats.find(c => c.id === selectedChat.id);
      if (updatedChat) setSelectedChat(updatedChat);
    }
    
    setRecordingDuration(0);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary">
                  <span className="text-xl font-bold text-white">С</span>
                </div>
                <h1 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-2xl font-bold text-transparent">
                  Связуха
                </h1>
              </div>
            </div>

            <TabsList className="grid w-full grid-cols-4 rounded-none border-0 bg-transparent p-0">
              <TabsTrigger
                value="chats"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                <Icon name="MessageSquare" size={20} className="mr-2" />
                Чаты
              </TabsTrigger>
              <TabsTrigger
                value="contacts"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                <Icon name="Users" size={20} className="mr-2" />
                Контакты
              </TabsTrigger>
              <TabsTrigger
                value="profile"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                <Icon name="User" size={20} className="mr-2" />
                Профиль
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                <Icon name="Settings" size={20} className="mr-2" />
                Настройки
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="chats" className="m-0 p-4">
            <div className="mb-4">
              <div className="relative">
                <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Поиск чатов..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-2">
                {chats.map((chat) => (
                  <Card
                    key={chat.id}
                    onClick={() => setSelectedChat(chat)}
                    className="cursor-pointer border-0 bg-card p-4 transition-all hover:bg-muted"
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="h-14 w-14">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-2xl">
                            {chat.avatar}
                          </AvatarFallback>
                        </Avatar>
                        {chat.online && (
                          <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-background bg-green-500" />
                        )}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{chat.name}</h3>
                          <span className="text-xs text-muted-foreground">{chat.time}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="truncate text-sm text-muted-foreground">{chat.lastMessage}</p>
                          {chat.unread > 0 && (
                            <Badge className="ml-2 bg-gradient-to-r from-primary to-secondary">
                              {chat.unread}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>

            <div className="fixed bottom-6 right-6">
              <Button
                size="lg"
                className="h-14 w-14 rounded-full bg-gradient-to-r from-primary to-secondary shadow-lg transition-transform hover:scale-110"
              >
                <Icon name="Plus" size={24} />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="contacts" className="m-0 p-4">
            <div className="mb-4">
              <div className="relative">
                <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Поиск контактов..." className="pl-10" />
              </div>
            </div>

            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-2">
                {mockContacts.map((contact) => (
                  <Card
                    key={contact.id}
                    className="cursor-pointer border-0 bg-card p-4 transition-all hover:bg-muted"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-xl">
                              {contact.avatar}
                            </AvatarFallback>
                          </Avatar>
                          {contact.online && (
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold">{contact.name}</h3>
                          <p className="text-sm text-muted-foreground">{contact.status}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" className="h-10 w-10">
                          <Icon name="Phone" size={20} />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-10 w-10">
                          <Icon name="Video" size={20} />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>

            <div className="fixed bottom-6 right-6">
              <Button
                size="lg"
                className="h-14 w-14 rounded-full bg-gradient-to-r from-primary to-secondary shadow-lg transition-transform hover:scale-110"
              >
                <Icon name="UserPlus" size={24} />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="m-0 p-4">
            <div className="mx-auto max-w-md space-y-6">
              <Card className="border-0 bg-card p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-5xl">
                      👤
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="mt-4 text-2xl font-bold">Иван Петров</h2>
                  <p className="text-muted-foreground">@ivan_petrov</p>
                  <Badge className="mt-2 bg-green-500">В сети</Badge>
                </div>
              </Card>

              <Card className="border-0 bg-card p-6">
                <h3 className="mb-4 font-semibold">О себе</h3>
                <p className="text-sm text-muted-foreground">
                  Люблю путешествовать и создавать классные проекты! 🚀
                </p>
              </Card>

              <Card className="border-0 bg-card p-6">
                <h3 className="mb-4 font-semibold">Информация</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Icon name="Mail" size={20} className="text-muted-foreground" />
                    <span className="text-sm">ivan@example.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Icon name="Phone" size={20} className="text-muted-foreground" />
                    <span className="text-sm">+7 (999) 123-45-67</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Icon name="Calendar" size={20} className="text-muted-foreground" />
                    <span className="text-sm">Зарегистрирован 15 января 2024</span>
                  </div>
                </div>
              </Card>

              <Card className="border-0 bg-card p-6">
                <h3 className="mb-4 font-semibold">Медиа</h3>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20"
                    />
                  ))}
                </div>
              </Card>

              <Button className="w-full bg-gradient-to-r from-primary to-secondary">
                Редактировать профиль
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="m-0 p-4">
            <div className="mx-auto max-w-md space-y-6">
              <Card className="border-0 bg-card p-6">
                <h3 className="mb-4 font-semibold">Уведомления</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Звук сообщений</Label>
                      <p className="text-sm text-muted-foreground">
                        Воспроизводить звук при получении сообщения
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Звук звонков</Label>
                      <p className="text-sm text-muted-foreground">
                        Воспроизводить мелодию при входящем звонке
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Вибрация</Label>
                      <p className="text-sm text-muted-foreground">
                        Включить вибрацию на мобильных устройствах
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </Card>

              <Card className="border-0 bg-card p-6">
                <h3 className="mb-4 font-semibold">Конфиденциальность</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Статус "В сети"</Label>
                      <p className="text-sm text-muted-foreground">
                        Показывать, когда вы онлайн
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Время последнего посещения</Label>
                      <p className="text-sm text-muted-foreground">
                        Показывать время последней активности
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Прочитанные сообщения</Label>
                      <p className="text-sm text-muted-foreground">
                        Отправлять уведомления о прочтении
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </Card>

              <Card className="border-0 bg-card p-6">
                <h3 className="mb-4 font-semibold">Медиа и звонки</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Голосовые сообщения</Label>
                      <p className="text-sm text-muted-foreground">
                        Разрешить запись голосовых сообщений
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Видеозвонки</Label>
                      <p className="text-sm text-muted-foreground">
                        Разрешить совершать видеозвонки
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>HD качество</Label>
                      <p className="text-sm text-muted-foreground">
                        Использовать высокое качество для видео
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </Card>

              <Card className="border-0 bg-card p-6">
                <h3 className="mb-4 font-semibold">О приложении</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Версия</span>
                    <span>1.0.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Разработчик</span>
                    <span>Связуха Team</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {selectedChat && (
        <div className="fixed inset-0 z-50 bg-background animate-fade-in">
          <div className="flex h-full flex-col">
            <div className="flex items-center gap-3 border-b border-border bg-card px-4 py-3">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setSelectedChat(null)}
              >
                <Icon name="ArrowLeft" size={24} />
              </Button>
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-xl">
                    {selectedChat.avatar}
                  </AvatarFallback>
                </Avatar>
                {selectedChat.online && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{selectedChat.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {selectedChat.online ? 'В сети' : 'Не в сети'}
                </p>
              </div>
              <Button size="icon" variant="ghost">
                <Icon name="Phone" size={20} />
              </Button>
              <Button size="icon" variant="ghost">
                <Icon name="Video" size={20} />
              </Button>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {selectedChat.messages?.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                        message.sender === 'me'
                          ? 'bg-gradient-to-r from-primary to-secondary text-white'
                          : 'bg-card'
                      }`}
                    >
                      {message.type === 'voice' ? (
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                          >
                            <Icon name="Play" size={16} />
                          </Button>
                          <div className="flex-1">
                            <div className="h-1 rounded-full bg-white/30">
                              <div className="h-full w-0 rounded-full bg-white" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm">{message.text}</p>
                      )}
                      <span className="mt-1 block text-xs opacity-70">
                        {message.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t border-border bg-card p-4">
              {isRecording ? (
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center">
                    <div className="h-3 w-3 animate-pulse rounded-full bg-red-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Запись голосового сообщения...</p>
                    <p className="text-xs text-muted-foreground">{recordingDuration} сек</p>
                  </div>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-10 w-10"
                    onMouseUp={handleStopRecording}
                    onTouchEnd={handleStopRecording}
                  >
                    <Icon name="Square" size={20} />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="ghost" className="h-10 w-10">
                    <Icon name="Paperclip" size={20} />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-10 w-10"
                    onMouseDown={handleStartRecording}
                    onTouchStart={handleStartRecording}
                  >
                    <Icon name="Mic" size={20} className="text-primary" />
                  </Button>
                <Input
                  placeholder="Введите сообщение..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="flex-1"
                />
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  className="h-10 w-10 bg-gradient-to-r from-primary to-secondary disabled:opacity-50"
                >
                  <Icon name="Send" size={20} />
                </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}